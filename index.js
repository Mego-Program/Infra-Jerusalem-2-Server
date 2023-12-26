import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
const { verify } = jwt;
const { json } = bodyParser;
import cors from 'cors'; 

import { User } from './models/userModel.js';
import routes from './routes/userRoutes.js'


const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: ['https://infra-jerusalem-2.vercel.app', "http://localhost:5173"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));app.use(json());




routes(app, User, jwt, bcrypt);





app.get('/', (req, res) => {
    res.send('Hello Infra-jerusalem-2 Team! This is our Express server.');
});


if(!process.env.IS_VERCEL){
  app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
  });
}

export default app;