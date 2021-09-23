const { Pool } = require('pg');

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'blogDB',
  password: 'password',
  port: 5432,
});


function createUser(user, callback) {
  pool.query("INSERT INTO users(username, password) VALUES($1, $2)", [user.username, user.password], (error, results) => {
    if (error) {
      throw error;
    } else {
      callback();
    }
  });
}

function getUsers(callback) {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      throw error;
    }
    callback(results.rows);
  });
}

function getUser(id, callback) {
  pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id], (error, results) => {
    if (error) {
      return callback(error);
    }
    return callback(null, results.rows[0]);
  });
}

function getUserByUsername(username, callback) {
  pool.query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username], (error, results) => {
    if (error) {
      return callback(err);
    } else if (results.rowCount < 1) {
      callback(null, null)
    } else {
      callback(null, results.rows[0]);
    }
  });
}

function updateUser(user) {
  pool.query("UPDATE users SET username = $2, password = $3 WHERE id = $1'", [user.id, user.username, user.password], (error, results) => {
    if (error) {
      throw error;
    }
  });
}


function deleteUser(id) {
  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
  });
}


function getRandomId(callback) {
  pool.query('SELECT * FROM users ORDER BY random() LIMIT 1', (error, results) => {
    if (error) {
      throw error;
    }
    callback(results.rows[0].id);
  });
}

module.exports = {
  getUsers,
  getUser,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getRandomId
}