import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Error initializing SQLite database:', err.message);
    process.exit(1);
  } else {
    console.log('SQLite database initialized.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS signers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      signer TEXT UNIQUE
    )
  `);
  // db.run(`
  //   CREATE TABLE txs (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     height INTEGER,
  //     hash TEXT UNIQUE,
  //     memo TEXT
  //   )
  // `);
  db.run(`
    CREATE TABLE IF NOT EXISTS packets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chain_id TEXT,
      signer_id INTEGER,
      memo TEXT,
      sequence INTEGER,
      source_channel TEXT,
      source_port TEXT,
      destination_channel TEXT,
      destination_port TEXT,
      msg_type_url TEXT,
      created_at TEXT,
      effected BOOL,
      FOREIGN KEY (signer_id) REFERENCES signers (id)
    )
  `);
});

export default db;