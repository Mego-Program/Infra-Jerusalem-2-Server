
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routers/acconutsRouts.js';
import { User } from './models/userModel.js';
dotenv.config();

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
