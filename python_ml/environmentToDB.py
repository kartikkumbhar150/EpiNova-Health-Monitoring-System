import pandas as pd
from sqlalchemy import create_engine

# --- 1. Supabase Connection Details (with SSL + encoded password) ---
SUPABASE_CONNECTION_URL = (
    ""
)

# --- 2. File and Table Details ---
CSV_FILE_NAME = "water_environment_dataset.csv"
TABLE_NAME = "environmental_factors"  # Table name


def clean_column_names(df):
    """Cleans column names for PostgreSQL compatibility."""
    df.columns = (
        df.columns.str.strip()
        .str.replace(" ", "_", regex=False)
        .str.replace("(", "", regex=False)
        .str.replace(")", "", regex=False)
        .str.replace("%", "percent", regex=False)
        .str.replace("/", "", regex=False)
        .str.lower()
    )
    return df


def upload_to_supabase():
    """Reads CSV, cleans data, and uploads it to the specified Supabase table."""
    try:
        # Load and clean the CSV
        df = pd.read_csv(CSV_FILE_NAME)
        print(f"✅ Successfully loaded {CSV_FILE_NAME} with {len(df)} records.")
        df = clean_column_names(df)
        print("✅ Column names cleaned for PostgreSQL compatibility.")

        # --- Create SQLAlchemy Engine ---
        engine = create_engine(SUPABASE_CONNECTION_URL)
        print("✅ SQLAlchemy Engine created.")

        # --- Data Cleaning ---
        for col in df.columns:
            if df[col].dtype == object and col not in [
                "overall_risk_level",
                "land_use_type",
                "rainfall_level",
                "humidity_level",
                "flood_risk",
                "sewage_treatment_quality",
                "waste_management_quality",
            ]:
                df[col] = pd.to_numeric(df[col], errors="ignore")

        # Drop only fully empty rows
        df = df.dropna(how="all")

        # --- Upload to Supabase ---
        df.to_sql(
            name=TABLE_NAME,
            con=engine,
            if_exists="replace",  # Replace existing table
            index=False,
            chunksize=1000,
            method="multi",  # Faster inserts
        )

        print(f"\n🎉 SUCCESS! Data uploaded to Supabase.")
        print(f"Schema created in table: **{TABLE_NAME}**")
        print(f"Total rows uploaded: {len(df)}")

        # Verification
        print("\nVerifying uploaded data:")
        with engine.connect() as connection:
            verification_df = pd.read_sql_table(TABLE_NAME, con=connection)
            print(verification_df.head())

    except FileNotFoundError:
        print(f"❌ Error: The file '{CSV_FILE_NAME}' was not found.")
    except Exception as e:
        print(
            f"❌ An error occurred during the database operation. "
            f"Check your connection string and network.\nError: {e}"
        )


if __name__ == "__main__":
    upload_to_supabase()
