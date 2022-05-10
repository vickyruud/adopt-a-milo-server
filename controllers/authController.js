const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()



const {
   createJWT,
} = require("../utils/auth");


const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.signup = (req, res, next) => {
  let { firstName,lastName, email, password, password_confirmation, id } = req.body;
  let errors = [];
  if (!firstName) {
    errors.push({ firstName: "required" });
  }
  if (!lastName) {
    errors.push({ lastName: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
 User.findOne({email: email})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "email already exists" }] });
       }else {
         const user = new User({
           firstName: firstName,
           lastName: lastName,
           email: email,
           password: password,
           id :id
         });
         bcrypt.genSalt(10, function (err, salt) {
           bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
              user.password = hash;
              user.save()
              .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
                console.log("logged in")
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
            });
         });
      });
     }
  }).catch(err =>{
      res.status(500).json({ erros: err })
      
  })
}

exports.signin = (req, res) => {
  console.log(req.body);
     let { email, password } = req.body;
     let errors = [];
     if (!email) {
       errors.push({ email: "required" });
     }
     if (!emailRegexp.test(email)) {
       errors.push({ email: "invalid email" });
     }
     if (!password) {
       errors.push({ passowrd: "required" });
     }
     if (errors.length > 0) {
      return res.status(422).json({ errors: errors });
     }
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({
        errors: [{ user: "not found" }],
      });
    } else {
      
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({
            errors: [{
              password: "incorrect"
            }] 
          });
        }
        let access_token = createJWT(
          user.email,
          user.id,
          3600
        );
          jwt.verify(access_token, process.env.TOKEN, (err,
            decoded) => {
              if (err) {
                res.status(500).json({ erros: err });
              }
              if (decoded) {
                return res.status(200).json({
                  success: true,
                  token: access_token,
                  message: user
                });
              }
            });
          }).catch(err => {
            res.status(500);
            console.log(err);
          });
          }
        }).catch(err => {
      res.status(500).json({ erros: err });
   });
}

