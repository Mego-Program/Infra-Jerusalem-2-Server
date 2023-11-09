const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const env = require('dotenv').config()

const User = require('./db');
const routes = require('./router');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors())
app.use(bodyParser.json());




routes(app, User, jwt, bcrypt);

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
      req.userId = decoded.id;
      next();
    });
  }



app.get('/', (req, res) => {
    res.send('Hello Infra-jerusalem-2 Team! This is our Express server.');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
