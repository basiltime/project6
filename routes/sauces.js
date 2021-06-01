const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config')


router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);



module.exports = router;