const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create movies table
db.serialize(() => {
  db.run(`
    CREATE TABLE movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      rating REAL NOT NULL,
      description TEXT NOT NULL
    )
  `);
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the IMDb Clone');
});

app.get('/movies', (req, res) => {
  db.all('SELECT * FROM movies', (err, rows) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('movies', { movies: rows });
  });
});

app.post('/movies', (req, res) => {
  const { title, year, genre, rating, description } = req.body;
  const query = `
    INSERT INTO movies (title, year, genre, rating, description)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [title, year, genre, rating, description], function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/movies');
  });
});

app.get('/movies/:id', (req, res) => {
  const query = 'SELECT * FROM movies WHERE id = ?';
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('movie', { movie: row });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
