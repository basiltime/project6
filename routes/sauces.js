const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config')

router.get('/', saucesCtrl.getAllSauces);
router.post('/', multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.get('/:id', saucesCtrl.getOneSauce);
router.post('/:id/like', saucesCtrl.likeOrDislike);
router.delete('/:id', auth, saucesCtrl.deleteSauce);


module.exports = router;