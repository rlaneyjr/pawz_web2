const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

app.set('view engine', 'ejs'); // Set template engine to ejs
// Theme pages
app.set('views', [path.join(__dirname, 'src/dev')]);
app.use(express.static(path.join(__dirname, 'src/dev/css')));
app.use(express.static(path.join(__dirname, 'src/dev/js')));
app.use(express.static(path.join(__dirname, 'src/images')));
app.use(morgan('tiny'));

// Theme pages
app.get('/', (req,res) => res.render('index')); // Landing page
app.get('/auth', (req,res) => res.render('auth')); // Authentication page
app.get('/page', (req,res) => res.render('page')); // Plain page
app.get('/dashboard', (req,res) => res.render('dashboard')); // Dashboard page

app.listen(3000, () => console.log('App listening on port 3000')); // Initialize the express server
