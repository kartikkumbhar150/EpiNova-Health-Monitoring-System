from flask import Flask, request, jsonify
import os, json, pickle, requests, psycopg2
import pandas as pd
import numpy as np
import joblib
import torch
import torch.nn as nn
from dotenv import load_dotenv
from langdetect import detect
from deep_translator import GoogleTranslator
from apscheduler.schedulers.background import BackgroundScheduler

# ================= ENV & CONFIG =================
load_dotenv()
GROQ_API_KEY = "your_groq_api_key_here"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

DATABASE_URL = ""
TABLE_NAME = "disease_reports"
AGGREGATE_TABLE = "patient_diseases"

# ================= FLASK APP =================
app = Flask(__name__)

# ================= DB CONFIG =================
def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# ===========================================================
# =============== 1. WATER QUALITY MODEL ====================
# ===========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   
MODEL_DIR = os.path.join(BASE_DIR, "trained_model")  
try:
    model = joblib.load(os.path.join(MODEL_DIR, "water_quality_model.joblib"))
    le_wq = joblib.load(os.path.join(MODEL_DIR, "label_encoder.joblib"))
    model_features = joblib.load(os.path.join(MODEL_DIR, "model_features.joblib"))
except Exception as e:
    print(f"[Water Quality] Error loading model assets: {e}")
    model, le_wq, model_features = None, None, None

required_input_cols = [
    'Water_pH', 'Water_Temperature_C', 'Turbidity', 'Dissolved_Oxygen',
    'Chloride', 'Solar_Radiation_Wm2', 'Land_Use_Type', 'Arsenic',
    'Sanitation_Coverage(%)', 'Fecal_Coliform', 'Rainfall_Level',
    'Total_Dissolved_Solids', 'Lead', 'Sulphate', 'COD', 'Nitrate',
    'Flood_Risk', 'BOD', 'Heavy_Metals_Index', 'Air_Temperature_C',
    'Sewage_Treatment_Quality', 'Ammonia', 'Humidity_Level',
    'Waste_Management_Quality', 'Population_Density_per_km2', 'Wind_Speed_kmh'
]

level_mapping = {'Very Low': 0, 'Low': 1, 'Moderate': 2, 'High': 3, 'High Risk': 4}
quality_mapping = {'Poor': 0, 'Moderate': 1, 'Good': 2}
ORDINAL_MAPS = {
    'Rainfall_Level': level_mapping,
    'Humidity_Level': level_mapping,
    'Flood_Risk': level_mapping,
    'Sewage_Treatment_Quality': quality_mapping,
    'Waste_Management_Quality': quality_mapping
}
NOMINAL_COL = 'Land_Use_Type'

@app.route("/api/v1/predict-environment", methods=["POST"])
def predict_environment():
    if model is None or le_wq is None or model_features is None:
        return jsonify({"error": "Model assets not loaded."}), 500

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data"}), 400

    if isinstance(data, dict):
        data = [data]

    df = pd.DataFrame(data)
    missing = set(required_input_cols) - set(df.columns)
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    if 'Sanitation_Coverage(%)' in df.columns:
        df.rename(columns={'Sanitation_Coverage(%)': 'Sanitation_Coveragepercent'}, inplace=True)

    numeric_cols = [
        'Water_pH', 'Water_Temperature_C', 'Turbidity', 'Dissolved_Oxygen',
        'Chloride', 'Solar_Radiation_Wm2', 'Arsenic', 'Sanitation_Coveragepercent',
        'Fecal_Coliform', 'Total_Dissolved_Solids', 'Lead', 'Sulphate', 'COD',
        'Nitrate', 'BOD', 'Heavy_Metals_Index', 'Air_Temperature_C', 'Ammonia',
        'Population_Density_per_km2', 'Wind_Speed_kmh'
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    if df.isna().any().any():
        return jsonify({"error": "Invalid/missing numeric values detected."}), 400

    for col, mapping in ORDINAL_MAPS.items():
        df[col] = df[col].map(mapping)
        if df[col].isna().any():
            return jsonify({"error": f"Invalid category found in column: {col}"}), 400

    df = pd.get_dummies(df, columns=[NOMINAL_COL], prefix=NOMINAL_COL, drop_first=True)
    X_final = pd.DataFrame(columns=model_features, index=df.index)
    for col in model_features:
        X_final[col] = df[col] if col in df.columns else 0.0
    X_final = X_final.astype(float)

    preds = model.predict(X_final)
    labels = le_wq.inverse_transform(preds)
    return jsonify({"predictions": labels.tolist()})

# ===========================================================
# =============== 2. DISEASE PREDICTOR MODEL ================
# ===========================================================
with open(os.path.join(BASE_DIR, "trained_model", "label_encoder.pkl"), "rb") as f:
    le_disease = pickle.load(f)

# Load symptom columns
with open(os.path.join(BASE_DIR, "trained_model", "symptom_columns.pkl"), "rb") as f:
    symptom_columns = pickle.load(f)
class DiseasePredictor(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(DiseasePredictor, self).__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, output_dim)
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)

disease_model = DiseasePredictor(len(symptom_columns), len(le_disease.classes_))
disease_model.load_state_dict(torch.load(os.path.join(MODEL_DIR, "model.pth"), map_location="cpu"))
disease_model.eval()

DISEASE_COLUMN_MAP = {
    "Leptospirosis": "leptospirosis", "Norovirus": "norovirus",
    "Legionnaires_Disease": "legionnaires_disease", "Dysentery_Bacillary": "dysentery_bacillary",
    "Typhoid_Fever": "typhoid_fever", "Rotavirus": "rotavirus", "Cholera": "cholera",
    "Giardiasis": "giardiasis", "Dysentery_Amoebic": "dysentery_amoebic",
    "Hepatitis_E": "hepatitis_e", "Hepatitis_A": "hepatitis_a",
    "Schistosomiasis": "schistosomiasis", "Cryptosporidiosis": "cryptosporidiosis",
    "Acute_Diarrhoeal_Disease": "acute_diarrhoeal_disease", "Poliomyelitis": "poliomyelitis",
    "E_coli_Diarrhea": "e_coli_diarrhea"
}

def predict_disease_from_symptoms(symptoms_json):
    try:
        symptoms = json.loads(symptoms_json) if isinstance(symptoms_json, str) else symptoms_json
    except Exception:
        symptoms = []
    if not isinstance(symptoms, list):
        symptoms = []
    x_vec = [1 if col in symptoms else 0 for col in symptom_columns]
    X = torch.tensor([x_vec], dtype=torch.float32)
    with torch.no_grad():
        outputs = disease_model(X)
        _, predicted = torch.max(outputs, 1)
        return le_disease.inverse_transform(predicted.numpy())[0]

def increment_patient_disease(village, disease):
    if disease not in DISEASE_COLUMN_MAP:
        return
    column = DISEASE_COLUMN_MAP[disease]
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT 1 FROM {AGGREGATE_TABLE} WHERE village = %s;", (village,))
    exists = cur.fetchone()
    if exists:
        cur.execute(f"UPDATE {AGGREGATE_TABLE} SET {column} = {column} + 1 WHERE village = %s;", (village,))
    else:
        all_columns = ', '.join(DISEASE_COLUMN_MAP.values())
        all_values_list = ['1' if col == column else '0' for col in DISEASE_COLUMN_MAP.values()]
        all_values_str = ', '.join(all_values_list)
        cur.execute(f"INSERT INTO {AGGREGATE_TABLE} (village, {all_columns}) VALUES (%s, {all_values_str});", (village,))
    conn.commit()
    cur.close()
    conn.close()

def auto_update_predictions():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(f"SELECT id, symptoms, village FROM {TABLE_NAME} WHERE predicted_disease IS NULL OR predicted_disease = '';")
    rows = cur.fetchall()
    for row in rows:
        patient_id, symptoms_json, village = row
        if not symptoms_json:
            continue
        predicted = predict_disease_from_symptoms(symptoms_json)
        cur.execute(f'UPDATE {TABLE_NAME} SET predicted_disease=%s WHERE id=%s', (predicted, patient_id))
        increment_patient_disease(village, predicted)
    conn.commit()
    cur.close()
    conn.close()

scheduler = BackgroundScheduler()
scheduler.add_job(func=auto_update_predictions, trigger="interval", seconds=30)
scheduler.start()

@app.route("/api/v1/predict-disease", methods=["POST"])
def predict_disease():
    data = request.get_json(force=True)
    required = ["symptoms", "village"]
    if not all(field in data for field in required):
        return jsonify({"error": f"missing fields. required: {required}"}), 400
    symptoms = data["symptoms"]
    village = data["village"]
    if not isinstance(symptoms, list):
        return jsonify({"error": "symptoms must be a list"}), 400
    predicted = predict_disease_from_symptoms(symptoms)
    increment_patient_disease(village, predicted)
    return jsonify({"predicted_disease": predicted, "message": f"✅ incremented {predicted} count for {village}"})

##################################################
##################TOP VILLAGES####################
##################################################

#of West Siang only

@app.route("/api/v1/top-villages", methods=["GET"])
def top_villages():
    """
    Return top villages of Arunachal Pradesh (West Siang district) with highest disease cases.
    Optional Query Parameters:
        limit (int) -> number of top villages to return (default 10)
    Example:
        /api/v1/top-villages?limit=5
    """
    # Hardcode state/district filter
    state = "Arunachal Pradesh"
    district = "West Siang"
    limit = request.args.get("limit", default=20, type=int)

    conn = get_db_connection()
    cur = conn.cursor()

    sum_expr = " + ".join(DISEASE_COLUMN_MAP.values())

    # Query filtered by state and district
    query = f"""
        SELECT village, ({sum_expr}) AS total_cases
        FROM {AGGREGATE_TABLE}
        WHERE state = %s AND district = %s
        ORDER BY total_cases DESC
        LIMIT %s;
    """
    cur.execute(query, (state, district, limit))
    rows = cur.fetchall()

    results = [{"village": row[0], "total_cases": row[1]} for row in rows]

    cur.close()
    conn.close()

    return jsonify({
        "state": state,
        "district": district,
        "top_villages": results,
        "message": f"Top {len(results)} villages in {district}, {state} by disease cases"
    })

################### By Percentage #################################

@app.route("/api/v1/top-villages-percentage", methods=["GET"])
def top_villages_percentage():
    """
    Return top villages of Arunachal Pradesh (West Siang district)
    by percentage of affected population.
    Optional Query Parameters:
        limit (int) -> number of top villages to return (default 20)
    Example:
        /api/v1/top-villages-percentage?limit=5
    """
    state = "Arunachal Pradesh"
    district = "West Siang"
    limit = request.args.get("limit", default=20, type=int)

    conn = get_db_connection()
    cur = conn.cursor()

    sum_expr = " + ".join(DISEASE_COLUMN_MAP.values())

    # Assuming AGGREGATE_TABLE has `population` column
    query = f"""
        SELECT village,
               ({sum_expr}) AS total_cases,
               population,
               CASE 
                   WHEN population > 0 THEN ROUND((({sum_expr})::numeric / population) * 100, 2)
                   ELSE 0
               END AS percentage_affected
        FROM {AGGREGATE_TABLE}
        WHERE state = %s AND district = %s
        ORDER BY percentage_affected DESC
        LIMIT %s;
    """
    cur.execute(query, (state, district, limit))
    rows = cur.fetchall()

    results = [
        {
            "village": row[0],
            "total_cases": int(row[1]),
            "population": int(row[2]),
            "percentage_affected": float(row[3])
        }
        for row in rows
    ]

    cur.close()
    conn.close()

    return jsonify({
        "state": state,
        "district": district,
        "top_villages_by_percentage": results,
        "message": f"Top {len(results)} villages in {district}, {state} by percentage affected"
    })

################### High risk villages ###################


@app.route("/api/v1/high-risk-villages", methods=["GET"])
def high_risk_villages():
    """
    Fetch names of villages in West Siang district with High Risk overall_risk_level
    from environmental_factors table.
    """
    district = "West Siang"
    risk_level = "High Risk"

    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        SELECT village
        FROM environmental_factors
        WHERE district = %s
          AND overall_risk_level = %s;
    """
    cur.execute(query, (district, risk_level))
    rows = cur.fetchall()

    # Extract village names from tuples
    village_names = [row[0] for row in rows]

    cur.close()
    conn.close()

    return jsonify({
        "district": district,
        "risk_level": risk_level,
        "high_risk_villages": village_names,
        "total": len(village_names)
    })

#####################  all the data of the village ##################




# ===========================================================
# =============== 3. CHATBOT ENDPOINT =======================
# ===========================================================
@app.route("/api/v1/chat", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"error": "message is required"}), 400

        detected_lang = detect(user_message)
        translated = GoogleTranslator(source="auto", target="en").translate(user_message) if detected_lang != "en" else user_message

        headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
        payload = {
            "model": "openai/gpt-oss-120b",
            "messages": [
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": translated}
            ],
            "temperature": 0.7
        }
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        data = response.json()
        ai_reply = data["choices"][0]["message"]["content"]

        final_reply = GoogleTranslator(source="en", target=detected_lang).translate(ai_reply) if detected_lang != "en" else ai_reply
        return jsonify({"reply": final_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return "🚀 Unified Flask App Running: Environment + Disease + Chatbot"

# ===========================================================
# ==================== MAIN =================================
# ===========================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)
