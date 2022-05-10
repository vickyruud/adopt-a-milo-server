const express = require('express');
const router = express.Router();
const axios = require('axios')
require('dotenv').config();


const clientId = process.env.API_KEY
const secret = process.env.API_SECRET 
let accessToken = ''


//gets the access token
const getToken = () => {  
  return axios.post("https://api.petfinder.com/v2/oauth2/token", {
  // eslint-disable-next-line @typescript-eslint/camel case
  client_id: clientId,
  // eslint-disable-next-line @typescript-eslint/camel case
  client_secret: secret,
  // eslint-disable-next-line @typescript-eslint/camel case
  grant_type: "client_credentials"
}).then(res => {
  return  res.data.access_token;

}).catch(error => {
  console.log(error);
})
}

//gets animal data with the access token
const getAnimals = (token) => {
 return axios
  .get("https://api.petfinder.com/v2/animals", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((response) => {
         return response.data.animals

  })
  .catch((error) => {
      console.error(error);
  });
}


//gets the animals data after obtaining a token
const getData = () => {

  return getToken().then(res => {
    return getAnimals(res).then(response => {
     return response
   })
 })

 
    
}

//route to pull all available animals
router.get('/animals', (req, res, next) => {
  getData().then(response => {
    res.send(response);
  })
});

module.exports = router;

