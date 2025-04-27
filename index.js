require('dotenv').config();

const express      = require('express');
const app          = express();
const mongoose     = require('mongoose');

const passport     = require('passport');
const flash        = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const session      = require('express-session');


const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

const { User, Item } = require('./app/models/models');


app.set('view_engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); 
require('./config/passport')(passport);
app.use(flash());


mongoose.connect(DB_URL)
  .then(() => {
    console.log('Listening to Database: Homez...');
    require('./app/routes.js')(app, passport, {User, Item});
  })
  .catch(err => {
    console.log(err);
  })

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
