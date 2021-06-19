const Sauce = require('../models/sauce')
const fs = require('fs');
const aws = require('aws-sdk');
const dotenv = require('dotenv').config({ path: './.env' });

exports.createSauce = (req, res, next) => {
 
    req.body.sauce = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: req.file.location,
      s3KeyName: req.file.key,
      s3BucketName: req.file.bucket,
      heat: req.body.sauce.heat,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });


    sauce.save()
      .then(
      () => {
        res.status(201).json({
          message: 'Sauce Saved!'
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


  


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  }

  exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
      sauce = {
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper, 
        imageUrl: req.file.location,
        heat: req.body.sauce.heat,
      };
      // Add code here to delete the old image from S3
      // Update the s3KeyName with the new S3 key.
    } else {
        sauce = {
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          heat: req.body.heat,
      };
   }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };


  exports.likeOrDislike = (req, res, next) => {
    let id = req.params.id;
    
    if (req.body.like == 1) {
    Sauce.findOneAndUpdate(
      {_id: id}, 
      {$push: {usersLiked: id}, likes: 1}
      ).then(
      () => {
              res.status(201).json({
                message: 'Sauce Liked by User'
              });
            }
      
            ).catch(
              (error) => {
                res.status(400).json({
                  error: error
                });
              }
            );

    } else if (req.body.like == -1) {
      Sauce.findOneAndUpdate(
        {_id: id}, 
        {$push: {usersDisliked: id}, dislikes: 1}).then(
        () => {
                res.status(201).json({
                  message: 'Sauce Disliked by User'
                });
              }
        
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );

    } else if (req.body.like == 0) {

      Sauce.findOneAndUpdate(
        {_id: id}, 
        {$pull: {usersLiked: id, usersDisliked: id}, dislikes: 0, likes: 0}).then(
        () => {
          res.status(201).json({
            message: 'No Likes or Dislikes'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );


  };
 
  }


  exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
        res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
        res.status(400).json({
            error: error
        });
        }
    );
    }


    exports.deleteSauce = (req, res, next) => {

  

      Sauce.findOne({_id: req.params.id}).then((sauce) => {
        const s3 = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: "us-east-2",
        });
        var params = {  Bucket: sauce.s3BucketName, Key: sauce.s3KeyName };

        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  // error
          else     console.log();                 // deleted
        });
        }
      );

      Sauce.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({
            message: 'Deleted!'
          });
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        })
    };
