const express = require('express');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', './views');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Session and passport
app.use(expressSession({
  secret: 'my_secret',
  resave: false,
  saveUninitiaded: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/dbUser').then(() => {
  console.log("Connection established!");
}).catch(err => {
  console.log("Failed to connect!" + err);
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register')
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.register(new User({username, password }), password, function(err, user) {
    if (err) {
      console.log(err);
      res.render('register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/dashboard');
      });
    }
  });
});

app.get('/login' , (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dasboard');
});

app.listen(3000, () => {
  console.log('Servidor ligado na porta 3000!');
});