import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
const { verify } = jwt;
const { json } = bodyParser;
import cors from 'cors'; 
//const env = require('dotenv').config()

import User from './db.js';
import routes from './router.js';


const app = express();
const port = process.env.PORT || 3000;


app.use(cors())
app.use(json());




routes(app, User, jwt, bcrypt);

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    verify(token, 'secret', (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
      req.userId = decoded.id;
      next();
    });
  }



app.get('/', (req, res) => {
    res.send('Hello Infra-jerusalem-2 Team! This is our Express server.');
});


if(!process.env.IS_VERCEL){
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}

export default app;