const express = require('express');
const User = require('../models/user');


const router = express.Router();

const { signup, signin } = require('../controllers/authController');

//routes for sign in and sign up
router.post('/signup', signup);
router.post('/signin', signin);


router.get('user/users', (req, res, next) => {
  // This will return all users
  User.find({})
    .then((data) => {
      res.json(data)
    })
    .catch(next);
});


module.exports = router;
