const { Pool } = require('pg');
var fs = require('fs');

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'blogDB',
    password: 'password',
    port: 5432,
});


var createPost = (post) => {
    let query = "INSERT INTO posts (title, content, img, date, author) VALUES ($1, $2, $3, $4, $5)";
    let values = [post.title, post.content, post.img, post.date, post.author];
    pool.query(query, values, function (err, result) {
        if (err) throw err;
        // console.log("1 record inserted");
    });
}

function getPost(id, callback) {
    pool.query("SELECT * FROM posts WHERE id = $1", [id], function (err, result, fields) {
        if (err) throw err;
        callback(result.rows[0]);
    });
}


function getPosts(callback) {
    pool.query("SELECT * FROM posts", function (err, result, fields) {
        if (err) throw err;
        callback(result.rows);
    });
}



function getPostsByAuthor(author,callback){
    pool.query("SELECT posts.id, title, content, date, img, username FROM posts INNER JOIN users ON posts.author = users.id WHERE posts.author = $1",[author], function (err, result, fields) {
        if (err) throw err;
        callback(result.rows);
    });
}

function deletePost(id, callback) {
    getPost(id, (post) => {
        fs.unlink(__dirname+"/../public"+post.img, function (err) {
            if(err) throw err;
        });
    });
    pool.query("DELETE FROM posts WHERE id = $1", [id], function (err, result) {
        if (err) throw err;
        callback();
    });
}

function updatePost(post, callback) {
    let query = "UPDATE posts SET title = $1, content = $2, img = $3, date = $4, author = $5 WHERE id =$6 ";
    let values = [post.title, post.content, post.img, post.date, post.author, post.id];
    pool.query(query, values, function (err, result) {
        if (err) throw err;
        callback();
    });
}


module.exports = {
    getPosts,
    getPost,
    getPostsByAuthor,
    createPost,
    updatePost,
    deletePost
}