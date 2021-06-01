const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces')
const path = require('path');

mongoose.connect('mongodb+srv://Krystal:Onion1989!@cluster0.ija7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows any request from any origin
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allows all of these API Requests
  next();
});



app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;