import pandas as pd
import psycopg2
from psycopg2 import sql

# ====== CONFIG ======
DATABASE_URL = ""
CSV_FILE = "data/northeast_villages_disease_data.csv"
TABLE_NAME = "patient_diseases"

# ====== Step 1: Read CSV ======
df = pd.read_csv(CSV_FILE)

# --- Clean column names for PostgreSQL ---
df.columns = (
    df.columns.str.strip()
    .str.replace(" ", "_", regex=False)
    .str.replace("(", "", regex=False)
    .str.replace(")", "", regex=False)
    .str.replace("%", "percent", regex=False)
    .str.replace("/", "_", regex=False)
    .str.lower()
)

# ====== Step 2: Infer SQL column types ======
def map_dtype(dtype):
    if "int" in str(dtype):
        return "INTEGER"
    elif "float" in str(dtype):
        return "FLOAT"
    else:
        return "TEXT"

columns = [
    sql.SQL("{} {}").format(sql.Identifier(col), sql.SQL(map_dtype(dtype)))
    for col, dtype in zip(df.columns, df.dtypes)
]

# ====== Step 3: Connect to Supabase Postgres ======
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Build CREATE TABLE
create_table_sql = sql.SQL("""
CREATE TABLE IF NOT EXISTS {table} (
    id SERIAL PRIMARY KEY,
    {fields}
)
""").format(
    table=sql.Identifier(TABLE_NAME),
    fields=sql.SQL(", ").join(columns),
)

cur.execute(create_table_sql)
conn.commit()
print(f"✅ Table `{TABLE_NAME}` created (if not exists).")

# ====== Step 4: Insert Data ======
insert_sql = sql.SQL(
    "INSERT INTO {table} ({fields}) VALUES ({placeholders})"
).format(
    table=sql.Identifier(TABLE_NAME),
    fields=sql.SQL(", ").join(map(sql.Identifier, df.columns)),
    placeholders=sql.SQL(", ").join(sql.Placeholder() * len(df.columns)),
)

for row in df.itertuples(index=False, name=None):
    cur.execute(insert_sql, row)

conn.commit()
print(f"✅ Inserted {len(df)} rows into `{TABLE_NAME}`.")

cur.close()
conn.close()
