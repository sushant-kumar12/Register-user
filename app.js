const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Sushant9304', // Replace with your MySQL password
  database: 'testdb'
});

db.connect((err) => {
  if (err) console.error('❌ Database connection failed:', err);
  else console.log('✅ Connected to MySQL database');
});

// Home form
app.get('/', (req, res) => {
  res.render('form');
});

// Insert new user
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('❌ Error inserting data:', err);
      res.send('Database error!');
    } else {
      res.render('success', { id: result.insertId });
    }
  });
});

// View all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching data:', err);
      res.send('Database error!');
    } else {
      res.render('users', { users: results });
    }
  });
});

// Edit user (load form)
app.get('/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('❌ Error fetching user:', err);
      res.send('Database error!');
    } else {
      res.render('edit', { user: result[0] });
    }
  });
});

// Update user (submit edit form)
app.post('/update/:id', (req, res) => {
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, req.params.id], (err, result) => {
    if (err) {
      console.error('❌ Error updating user:', err);
      res.send('Database error!');
    } else {
      console.log('✅ User updated:', req.params.id);
      res.redirect('/users');
    }
  });
});

// Delete user
app.get('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting user:', err);
      res.send('Database error!');
    } else {
      console.log('🗑️ User deleted:', req.params.id);
      res.redirect('/users');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

