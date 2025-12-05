import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

# ===============================
# 1. Load & Clean Dataset
# ===============================
df = pd.read_csv("data/water_environment_dataset.csv")

# Standardize and clean column names
df.columns = df.columns.str.strip().str.replace(" ", "_").str.replace("(", "").str.replace(")", "").str.replace("%", "percent").str.replace("/", "")

# Correct feature and target lists
required_cols = [
    'Water_pH', 'Water_Temperature_C', 'Turbidity', 'Dissolved_Oxygen',
    'Chloride', 'Solar_Radiation_Wm2', 'Land_Use_Type', 'Arsenic',
    'Sanitation_Coveragepercent', # Corrected name
    'Fecal_Coliform', 'Rainfall_Level',
    'Total_Dissolved_Solids', 'Lead', 'Sulphate', 'COD', 'Nitrate',
    'Flood_Risk', 'BOD', 'Heavy_Metals_Index', 'Air_Temperature_C',
    'Sewage_Treatment_Quality', 'Ammonia', 'Humidity_Level',
    'Waste_Management_Quality', 'Population_Density_per_km2',
    'Wind_Speed_kmh'
]
target_col = "Overall_Risk_Level" # Corrected target column

# --- Preprocessing ---
cat_cols = ['Rainfall_Level', 'Humidity_Level', 'Flood_Risk', 'Sewage_Treatment_Quality', 'Land_Use_Type', 'Waste_Management_Quality']
numeric_cols = list(set(required_cols) - set(cat_cols))

# Convert numeric columns, handling mixed types
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Handle Missing Values
df = df.dropna(subset=required_cols + [target_col]).reset_index(drop=True)

# Define and apply Ordinal Encoding (must be consistent in Flask app)
level_mapping = {'Very Low': 0, 'Low': 1, 'Moderate': 2, 'High': 3, 'High Risk': 4}
quality_mapping = {'Poor': 0, 'Moderate': 1, 'Good': 2}

for col in ['Rainfall_Level', 'Humidity_Level', 'Flood_Risk']:
    df[col] = df[col].map(level_mapping)

for col in ['Sewage_Treatment_Quality', 'Waste_Management_Quality']:
    df[col] = df[col].map(quality_mapping)

# One-Hot Encode 'Land_Use_Type'
df = pd.get_dummies(df, columns=['Land_Use_Type'], drop_first=True)

# Update feature list after encoding
feature_cols = [col for col in required_cols if col not in cat_cols]
ohe_cols = [col for col in df.columns if col.startswith('Land_Use_Type_')]
feature_cols.extend(ohe_cols)


# Encode target variable
le = LabelEncoder()
df[target_col] = le.fit_transform(df[target_col])


# ===============================
# 2. Train Model
# ===============================
X = df[feature_cols]
y = df[target_col]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a more robust model for higher accuracy
model = RandomForestClassifier(n_estimators=300, max_depth=15, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Test Accuracy: {accuracy:.4f}")

# ===============================
# 3. Save Model & Encoder
# ===============================
joblib.dump(model, "water_quality_model.joblib")
joblib.dump(le, "label_encoder.joblib")
joblib.dump(feature_cols, "model_features.joblib") # Save feature list for Flask app consistency
print("✅ Model, LabelEncoder, and feature list saved")