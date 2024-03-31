const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./database.db');

// Create table if not exists
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, note TEXT, collection_name TEXT, tag TEXT, url TEXT, user_id INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Add data to database
router.post('/:user_id', (req, res) => {
  const { name, note, collection_name, tag, url } = req.body;
  const user_id = req.params.user_id;
  db.run("INSERT INTO data (name, note, collection_name, tag, url, user_id) VALUES (?, ?, ?, ?, ?, ?)", [name, note, collection_name, tag, url, user_id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Data added successfully',
      data: {
        id: this.lastID,
        name,
        note,
        collection_name,
        tag,
        url,
        user_id
      }
    });
  });
});

// Retrieve all data for a specific user
router.get('/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  db.all("SELECT * FROM data WHERE user_id = ?", [user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
