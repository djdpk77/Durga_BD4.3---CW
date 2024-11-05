const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

//app.use(express.static('static'));

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllMovies() {
  let query = 'SELECT * FROM movies';
  let response = await db.all(query, []);

  return { movies: response };
}

app.get('/movies', async (req, res) => {
  try {
    let results = await fetchAllMovies();

    if (results.movies.length === 0) {
      return res.status(404).json({ message: 'No Movies Found.' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterByActor(actor) {
  let query = 'SELECT * FROM movies WHERE actor = ?';
  let response = await db.all(query, [actor]);

  return { movies: response };
}

app.get('/movies/actor/:actor', async (req, res) => {
  let actor = req.params.actor;

  try {
    const results = await filterByActor(actor);

    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No movies found for actor : ' + actor });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function filterByDirector(director) {
  let query = 'SELECT * FROM movies WHERE director = ?';
  let response = await db.all(query, [director]);

  return { movies: response };
}

app.get('/movies/director/:director', async (req, res) => {
  let director = req.params.director;

  try {
    const results = await filterByDirector(director);

    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: 'No movies found for director : ' + director });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
