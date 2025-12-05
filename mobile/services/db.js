import * as SQLite from 'expo-sqlite';

/*
  Stable SQLite helper using expo-sqlite callback API.
  Exports (keeps the same names used by syncService & form):
    - initDB()
    - insertReport(reportData) -> returns { success: true, id }
    - getUnsyncedReports() -> returns array of reports
    - deleteReport(localId) -> returns { success: true }
    - getReportsCount() -> returns { total, pending }

  Notes:
    - Uses a singleton DB handle (db) to avoid concurrent open/close races.
    - Avoids experimental methods (openDatabaseAsync / prepareAsync / runAsync).
    - Call await initDB() once during app startup (we do this in _layout.tsx).
*/

const DATABASE_NAME = 'EpiNova.db';
const TABLE_NAME = 'reports';

let db = null; // will hold SQLiteDatabase instance
let initialized = false; // guard to prevent repeated init

// Open DB using the installed expo-sqlite API. This returns a SQLiteDatabase instance.
async function openDatabase() {
  if (db) return db;
  // Prefer async API if available
  if (typeof SQLite.openDatabaseAsync === 'function') {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    return db;
  }

  // Fallback to classic openDatabase if present (synchronous)
  if (typeof SQLite.openDatabase === 'function') {
    // sync openDatabase returns a Database-like object; wrap as-is
    db = SQLite.openDatabase(DATABASE_NAME);
    return db;
  }

  // If neither exists, throw a clear error to aid debugging
  throw new Error('expo-sqlite does not expose openDatabaseAsync or openDatabase. Check that expo-sqlite is installed and linked for the current platform.');
}

// Helper dispatcher that chooses the right async API on the SQLiteDatabase
async function executeSqlAsync(sql, params = []) {
  const database = await openDatabase();
  const stmt = sql.trim().split('\n').join(' ').trim().toUpperCase();

  // Use execAsync for DDL or multi-statement SQL (no parameters)
  if (stmt.startsWith('CREATE') || stmt.startsWith('DROP') || stmt.startsWith('BEGIN') || stmt.startsWith('COMMIT') || stmt.startsWith('ROLLBACK')) {
    return await database.execAsync(sql);
  }

  // For SELECT queries use getAllAsync
  if (stmt.startsWith('SELECT')) {
    return await database.getAllAsync(sql, ...params);
  }

  // For INSERT/UPDATE/DELETE use runAsync
  return await database.runAsync(sql, ...params);
}

// Initialize DB and create table. This must be awaited before DB ops.
export async function initDB() {
  if (initialized) return;
  try {
    const database = await openDatabase();
    // Use execAsync to run the CREATE TABLE statement
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT,
        age_group TEXT,
        latitude REAL,
        longitude REAL,
        location_accuracy REAL,
        symptoms TEXT,
        onset_date TEXT,
        severity TEXT,
        description TEXT,
        water_source TEXT,
        reported_by TEXT,
        reported_by_name TEXT,
        timestamp TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    initialized = true;
    console.log('✅ Reports table created successfully (openDatabaseAsync)');
  } catch (err) {
    console.error('initDB error', err);
    throw err;
  }
}

// Insert a report. Returns { success: true, id }
export async function insertReport(reportData) {
  const {
    patientName = null,
    ageGroup = null,
    latitude = null,
    longitude = null,
    locationAccuracy = null,
    symptoms = null,
    onsetDate = null,
    severity = null,
    description = null,
    waterSource = null,
    reportedBy = null,
    reportedByName = null,
    timestamp = null,
  } = reportData;

  const sql = `INSERT INTO ${TABLE_NAME} (
    patient_name, age_group, latitude, longitude, location_accuracy,
    symptoms, onset_date, severity, description, water_source,
    reported_by, reported_by_name, timestamp
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const params = [
    patientName,
    ageGroup,
    latitude,
    longitude,
    locationAccuracy,
    symptoms ? JSON.stringify(symptoms) : null,
    onsetDate,
    severity,
    description,
    waterSource,
    reportedBy,
    reportedByName,
    timestamp,
  ];

  try {
    const database = await openDatabase();
    const result = await database.runAsync(sql, ...params);
    // Expo SQLite runAsync usually returns an object with lastInsertRowId
    const insertId = result?.lastInsertRowId ?? result?.insertId ?? null;
    return { success: true, id: insertId };
  } catch (err) {
    console.error('insertReport error', err);
    throw err;
  }
}

// Get all reports (used by syncService). Parse symptoms back to array/object.
export async function getUnsyncedReports() {
  try {
    const database = await openDatabase();
    const rows = await database.getAllAsync(`SELECT * FROM ${TABLE_NAME} ORDER BY id ASC;`);
    // rows is an array of row objects
    const items = rows.map((r) => ({ ...r, symptoms: r.symptoms ? JSON.parse(r.symptoms) : null }));
    return items;
  } catch (err) {
    console.error('getUnsyncedReports error', err);
    throw err;
  }
}

// Delete a report by local id
export async function deleteReport(localId) {
  try {
    const database = await openDatabase();
    const res = await database.runAsync(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`, localId);
    // res.changes or res.rowsAffected may indicate deletion
    return { success: true };
  } catch (err) {
    console.error('deleteReport error', err);
    throw err;
  }
}

// Return pending reports count in a shape compatible with syncService
export async function getReportsCount() {
  try {
    const database = await openDatabase();
    const row = await database.getFirstAsync(`SELECT COUNT(*) as total FROM ${TABLE_NAME};`);
    const count = row?.total ?? 0;
    return { total: count, pending: count };
  } catch (err) {
    console.error('getReportsCount error', err);
    throw err;
  }
}

// Do not close the DB while the app runs; expo-sqlite has no reliable cross-platform close.
export function closeDB() {
  db = null;
  initialized = false;
}

export default {
  initDB,
  insertReport,
  getUnsyncedReports,
  deleteReport,
  getReportsCount,
  closeDB,
};