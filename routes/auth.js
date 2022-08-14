const express = require('express');
const auth = require('../middlewares/auth')

const route = express.Router();

const {
   register,
   login,
   payment,
   genToken
} = require('../controller/auth')

route.post('/register',register);
route.post('/login',login);
route.post('/payment',auth,payment);
route.post('/token',genToken);

module.exports = route;