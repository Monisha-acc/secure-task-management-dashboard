import Database from 'better-sqlite3';
import path from 'path';

// Resolve absolute path to the SQLite database file
const DB_PATH = path.join(__dirname, '../../data/tasks.db');

// Initialise SQLite and create tables if they don't exist
const db = new Database(DB_PATH);

// Enable foreign key constraints — SQLite disables them by default
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'todo' CHECK(status IN ('todo','in-progress','done')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low','medium','high')),
    due_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;