const express = require('express');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/dbUser').then(() => {
  console.log("Connection established!");
}).catch(err => {
  console.log("Failed to connect!");
  console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register')
});

app.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const user = new User({ name, username, password });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.send('Error registering user.');
  }
});

app.get('/login' , (req, res) => {
  res.render('login');
});

app.listen(3000, () => {
  console.log('Servidor ligado na porta 3000!');
});
