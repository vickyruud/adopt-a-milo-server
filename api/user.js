const express = require('express');
const User = require('../models/user');


const router = express.Router();

const { signup, signin } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);


router.get('/users', (req, res, next) => {
  // This will return all recipes
  User.find({})
    .then((data) => {
      res.json(data)
    })
    .catch(next);
});


module.exports = router;
