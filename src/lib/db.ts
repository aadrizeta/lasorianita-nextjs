import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "lasorianita.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables(db);
  }
  return db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS solicitudes_empleo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      fecha_nacimiento TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT NOT NULL,
      archivos TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente',
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}
