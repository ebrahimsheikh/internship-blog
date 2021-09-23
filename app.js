const express = require('express');
const bodyParser = require('body-parser');
const dateFormat = require("dateformat");
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const upload = multer({ dest: __dirname + '/public/uploads/images' });
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());


const {
  getUsers,
  getUser,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getRandomId
} = require("./postgresql/usersApi.js");

const {
  getPosts,
  getPost,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost
} = require("./postgresql/postsApi.js");
const req = require('express/lib/request');


passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  getUserByUsername(username, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function (username, password, done) {
    getUserByUsername(username, function (err, user) {
      // console.log(user.username);
      if (err) { return done(err); }
      if (!user) {
        // console.log("someshit");
        return done(null, false, { message: 'Incorrect username.' });
      }//fix this later
      if (password !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


app.get('/', (req, res) => {
  res.redirect("/posts");
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


app.post('/checkUser', (req, res) => {
  getUserByUsername(req.body.username, (err, result) => {
    if (err) {
      throw err;
    } else if (result !== null) {
      res.send({ exists: true });
    } else {
      res.send({ exists: false });
    }
  })
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/routs/signup.html");
});

app.post('/signup', (req, res, next) => {
  let user = { username: req.body.username, password: req.body.password };
  createUser(user, () => {
    req.login(user, function (err) {
      if (err) { return next(err); }
      return res.redirect("/post");
    });
  });


});

app.get('/signin', (req, res) => {
  res.sendFile(__dirname + "/routs/signin.html");
});

app.post('/signin', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/signin'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.redirect('/managePosts');
    });
  })(req, res, next);
});

app.get('/post', (req, res) => {
  if (req.isAuthenticated()) {
    res.render("creatPost", { post: null });
  } else {
    res.redirect("/signin");
  }

});

app.post('/post', upload.single('img'), (req, res, next) => {

  if (req.isAuthenticated()) {

    getRandomId((id) => {
      let today = new Date();
      let date = today.toISOString().substring(0, 10);
      const post = { title: req.body.title, content: req.body.content, img: "/uploads/images/" + req.file.filename, date: date, author: req.user.id };
      createPost(post);
      res.redirect("/posts");
    });
  }


});

app.get('/posts', (req, res) => {
  getPosts((result) => { res.render("posts", { posts: result }); });
});

app.get('/posts/:id', (req, res) => {
  getPost(req.params.id, (result) => { res.render("post", { post: result, dateFormat: dateFormat }); })
});

app.get('/managePosts', (req, res) => {
  if (req.isAuthenticated()) {
    getPostsByAuthor(req.user.id, (results) => { res.render("managePosts", { posts: results, dateFormat: dateFormat }); })
  } else {
    res.redirect("signin");
  }
});

app.get('/delete/:id', (req, res) => {
  deletePost(req.params.id, () => {
    res.redirect("/managePosts")
  });
});

app.get('/edit/:id', (req, res) => {
  getPost(req.params.id, (result) => { res.render("creatPost", { post: result }); });
});

app.post('/update/:id', upload.single('img'), (req, res, next) => {
  getRandomId((id) => {
    let today = new Date();
    let date = today.toISOString().substring(0, 10);
    const post = { title: req.body.title, content: req.body.content, img: "/uploads/images/" + req.file.filename, date: date, author: id };
    updatePost(post, () => { res.redirect("/managePosts"); });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
