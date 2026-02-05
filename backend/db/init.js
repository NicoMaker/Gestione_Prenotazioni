// backend/db/init.js
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../database.sqlite");

// Crea connessione al database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Errore connessione database:", err.message);
    process.exit(1);
  }
  console.log("✅ Connesso al database SQLite:", DB_PATH);
});

// Abilita WAL mode per migliori performance con scritture concorrenti
db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");

/**
 * Inizializza il database creando le tabelle se non esistono
 */
function initDatabase() {
  db.serialize(() => {
    // ========== TABELLA UTENTI ==========
    db.run(`
      CREATE TABLE IF NOT EXISTS utenti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error("Errore creazione tabella utenti:", err);
      } else {
        console.log("✅ Tabella 'utenti' verificata");
        
        // Crea utente admin di default se non esiste
        db.get("SELECT id FROM utenti WHERE nome = 'admin'", async (err, user) => {
          if (!user) {
            try {
              const hashedPassword = await bcrypt.hash("admin123", 10);
              db.run(
                "INSERT INTO utenti (nome, password, role) VALUES (?, ?, ?)",
                ["admin", hashedPassword, "admin"],
                (err) => {
                  if (err) {
                    console.error("❌ Errore creazione utente admin:", err);
                  } else {
                    console.log("✅ Utente admin creato (admin/admin123)");
                  }
                }
              );
            } catch (error) {
              console.error("❌ Errore hashing password admin:", error);
            }
          }
        });
      }
    });

    // ========== TABELLA CLIENTI ==========
    db.run(`
      CREATE TABLE IF NOT EXISTS clienti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        num_tel TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error("Errore creazione tabella clienti:", err);
      } else {
        console.log("✅ Tabella 'clienti' verificata");
      }
    });

    // ========== TABELLA MARCHE ==========
    db.run(`
      CREATE TABLE IF NOT EXISTS marche (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error("Errore creazione tabella marche:", err);
      } else {
        console.log("✅ Tabella 'marche' verificata");
      }
    });

    // ========== TABELLA MODELLI ==========
    db.run(`
      CREATE TABLE IF NOT EXISTS modelli (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        marche_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (marche_id) REFERENCES marche(id),
        UNIQUE(nome, marche_id)
      )
    `, (err) => {
      if (err) {
        console.error("Errore creazione tabella modelli:", err);
      } else {
        console.log("✅ Tabella 'modelli' verificata");
      }
    });

    // ========== TABELLA ORDINI ==========
    db.run(`
      CREATE TABLE IF NOT EXISTS ordini (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        data_movimento DATETIME DEFAULT CURRENT_TIMESTAMP,
        modello_id INTEGER,
        marca_id INTEGER,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clienti(id),
        FOREIGN KEY (modello_id) REFERENCES modelli(id),
        FOREIGN KEY (marca_id) REFERENCES marche(id)
      )
    `, (err) => {
      if (err) {
        console.error("Errore creazione tabella ordini:", err);
      } else {
        console.log("✅ Tabella 'ordini' verificata");
      }
    });

    // ========== TABELLA AUDIT LOG (per tracciare modifiche) ==========
    db.run(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_name TEXT,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id INTEGER,
        old_value TEXT,
        new_value TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES utenti(id)
      )
    `, (err) => {
      if (err) {
        console.error("Errore creazione tabella audit_log:", err);
      } else {
        console.log("✅ Tabella 'audit_log' verificata");
      }
    });

    // ========== INDICI PER PERFORMANCE ==========
    db.run(`CREATE INDEX IF NOT EXISTS idx_ordini_cliente ON ordini(cliente_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ordini_modello ON ordini(modello_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ordini_marca ON ordini(marca_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_ordini_data ON ordini(data_movimento)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_modelli_marca ON modelli(marche_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name)`);

    console.log("✅ Indici del database verificati");
    console.log("🎉 Inizializzazione database completata\n");
  });
}

/**
 * Funzione per registrare azioni nell'audit log
 */
function logAudit(userId, userName, action, tableName, recordId, oldValue, newValue, ipAddress) {
  db.run(
    `INSERT INTO audit_log (user_id, user_name, action, table_name, record_id, old_value, new_value, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      userName,
      action,
      tableName,
      recordId,
      oldValue ? JSON.stringify(oldValue) : null,
      newValue ? JSON.stringify(newValue) : null,
      ipAddress
    ],
    (err) => {
      if (err) {
        console.error("❌ Errore logging audit:", err);
      }
    }
  );
}

/**
 * Funzione per eseguire backup del database
 */
function backupDatabase(backupPath) {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    const readStream = fs.createReadStream(DB_PATH);
    const writeStream = fs.createWriteStream(backupPath);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", () => {
      console.log(`✅ Backup database creato: ${backupPath}`);
      resolve(backupPath);
    });

    readStream.pipe(writeStream);
  });
}

/**
 * Funzione per ottenere statistiche database
 */
function getDatabaseStats(callback) {
  const stats = {};

  db.get("SELECT COUNT(*) as count FROM clienti", (err, result) => {
    if (err) return callback(err);
    stats.clienti = result.count;

    db.get("SELECT COUNT(*) as count FROM ordini", (err2, result2) => {
      if (err2) return callback(err2);
      stats.ordini = result2.count;

      db.get("SELECT COUNT(*) as count FROM marche", (err3, result3) => {
        if (err3) return callback(err3);
        stats.marche = result3.count;

        db.get("SELECT COUNT(*) as count FROM modelli", (err4, result4) => {
          if (err4) return callback(err4);
          stats.modelli = result4.count;

          db.get("SELECT COUNT(*) as count FROM utenti", (err5, result5) => {
            if (err5) return callback(err5);
            stats.utenti = result5.count;

            callback(null, stats);
          });
        });
      });
    });
  });
}

/**
 * Chiudi connessione database
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.error("❌ Errore chiusura database:", err);
        reject(err);
      } else {
        console.log("✅ Database chiuso correttamente");
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  initDatabase,
  logAudit,
  backupDatabase,
  getDatabaseStats,
  closeDatabase
};