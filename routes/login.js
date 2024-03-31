const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios')

const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// Create users table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE
  )`);
});

// Add data to database
router.post('/', (req, res) => {
    const { user_token } = req.body;

    if (!user_token) {
      return res.status(400).json({ error: 'User token is required' });
    }
  
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user_token}`, {
      headers: {
        Authorization: `Bearer ${user_token}`,
        Accept: 'application/json'
      }
    })
    .then((response) => {
      const profile = response.data;
      
      // Check if profile data is retrieved
      if (!profile || !profile.email || !profile.name) {
        return res.status(401).json({ error: 'Login failed. Unable to retrieve user information from Google.' });
      }
  
      const user = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          pic:profile.pic
        };
  
      db.get('SELECT * FROM users WHERE email = ?', [profile.email], (err, row) => {
          if (err) {
            console.error('Error during database query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
    
          if (!row) {
            // If user doesn't exist, insert them into the database
            db.run('INSERT INTO users (name, email) VALUES (?, ?)', [profile.name, profile.email], (err) => {
              if (err) {
                console.error('Error during user insertion:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
              }
              res.json({ success: true,user, message: 'Login successful[New User]' });

            })
          }
      // Check user account in the database or create a new one
      // You should replace this part with your database logic
      // Here you would typically interact with your database to check/create the user account
      // For demonstration purposes, I'm just sending back the user object
      else 
      res.json({ success: true, user , message:'Done, [Old User]'});

            //Cant set res again.
            // // Redirect to another API endpoint and pass user ID as query parameter
            // const otherAPIUrl = 'http://localhost:3000/api/data'; // Replace with your API URL
            // const userId = user.id;
            // res.redirect(`${otherAPIUrl}?userId=${userId}`);
    });
  
  
  
  
  })
  .catch((error) => {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });



module.exports = router;
