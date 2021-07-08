const Sauce = require('../models/sauce')
const aws = require('aws-sdk');
const dotenv = require('dotenv').config({ path: './.env' });
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
});




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
    if (req.file) {
      Sauce.findOne({_id: req.params.id}).then((sauce) => {
        const params = {  
          Bucket: sauce.s3BucketName, 
          Key: sauce.s3KeyName 
        };
        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  
          else     console.log('Successfully replaced image!');                
        });
      });

      req.body.sauce = JSON.parse(req.body.sauce);
      sauce = {
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper, 
        imageUrl: req.file.location,
        heat: req.body.sauce.heat,
        s3KeyName: req.file.key,
      }

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
        message: 'Sauce Updated!'
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

  //////////////////    Like or Dislike   //////////////////////////////
 
  exports.likeOrDislike = (req, res, next) => {
    let id = req.params.id;

     // Liked /////////////////////////////////////////////////////////////
     if (req.body.like == 1) {
      Sauce.findById({_id: id}).then(
        (sauce) => {
            // If the userId is in the usersLiked array, remove it and then subtract one like
            if (!sauce.usersLiked.includes(req.body.userId)) {
              Sauce.findOneAndUpdate(
                {_id: id},
                {$push: {usersLiked: req.body.userId}, $inc: {likes: 1}}
              ).then( 
                () => {
                  res.status(201).json({
                    message: 'Sauce Liked'
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
        }
      )
    
    // Disliked /////////////////////////////////////////////////////////////
    } else if (req.body.like == -1) {
        Sauce.findById({_id: id}).then(
          (sauce) => {
              // If the user has not disliked the sauce already, add them to the usersDisliked array and increase dislikes by 1
              if (!sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.findOneAndUpdate(
                  {_id: id},
                  {$push: {usersDisliked: req.body.userId}, $inc: {dislikes: 1}}
                ).then( 
                  () => {
                    res.status(201).json({
                      message: 'Sauce Disliked'
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
          }
        )

    // Like or dislike removed /////////////////////////////////////////////////
    } else if (req.body.like == 0) {
      
      Sauce.findById({_id: id}).then(
        (sauce) => {
            // If a like was canceled /////////////////////////////////////////////////
            if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.findOneAndUpdate(
                {_id: id},
                {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}}
              ).then( 
                () => {
                  res.status(201).json({
                    message: 'Likes Updated'
                  });
              }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
            // If a dislike was canceled /////////////////////////////////////////////////
            } else if (sauce.usersDisliked.includes(sauce.userId)) {
              Sauce.findOneAndUpdate(
                {_id: id},
                {$pull: {usersDisliked: sauce.userId}, $inc: {dislikes: -1}}
            ).then( 
              () => {
                res.status(201).json({
                  message: 'Likes Updated'
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
        }
      )
    }
   
} // closes main bracket
            


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
      // Find the sauce in mongodb, then delete the image from S3
      Sauce.findOne({_id: req.params.id}).then((sauce) => {
        const params = {  Bucket: sauce.s3BucketName, Key: sauce.s3KeyName };
        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  
          else     console.log('Deleted');                
        });
        }
      );
      // Delete sauce from mongodb
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
