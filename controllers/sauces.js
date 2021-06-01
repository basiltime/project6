const Sauce = require('../models/sauce')

exports.createSauce = (req, res, next) => {
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
  }

exports.getAllSauces = (req, res, next) => {
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
  }