const express = require('express');
const router = express.Router();
const Sauce = require('../models/sauce.js')
const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');

//router.get('/', auth, saucesCtrl.getAllSauces);

router.post('/', saucesCtrl.createSauce);
  
  
router.get('/', saucesCtrl.getAllSauces);

module.exports = router;