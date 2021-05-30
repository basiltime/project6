const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const Sauce = require('./models/sauce')


mongoose.connect('mongodb+srv://Krystal:Onion1989!@cluster0.ija7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

// Cross Origin Resource Sharing (CORS) is a standard that allows us to relax default security rules which prevent HTTP
// calls from being made between different servers. In this case, we have two origins: localhose:3000 and localhost:4200,
// and we need them to communicate with each other. For this, we need to add response headers to our response object.
app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows any request from any origin
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allows all of these API Requests
  next();
});


app.post('/api/sauces', (req, res, next) => {
  const sauce = new Sauce({
    _id: 'oeihffdfzeoi',
    name: 'Jalapeno Holler',
    manufacturer: 'Tierra Hot Sauce Brand',
    description: 'Made from extra hot Jalapenos',
    mainPepper: 'Jalapeno',
    imageUrl: 'qsomihvqios',
    heat: 6,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


 app.use('/api/sauces', (req, res, next) => {
  const sauces = [
    {
      _id: 'oeihffdfzeoi',
      name: 'Aji Panca',
      manufacturer: 'Tierra Hot Sauce Brand',
      description: 'Smokey, fruity, rich and mild hot sauce made from the Aji Panca chile of Peru.',
      mainPepper: 'Aji Panca',
      imageUrl: 'qsomihvqios',
      heat: 2,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    },
    {
     _id: 'oeihfze4fd3oi',
      name: 'Ancho Ghost',
      manufacturer: 'Tierra Hot Sauce Brand',
      description: '95% Ancho with 5% Ghost. Bright, powerful, flavorful, with a gorgeous red color.',
      mainPepper: 'Ancho/Ghost',
      imageUrl: 'qsomihvqios',
      heat: 2,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    }
  ];
  res.status(200).json(sauces);
});


app.use('/api/auth', userRoutes);
app.use(bodyParser.json());

module.exports = app;