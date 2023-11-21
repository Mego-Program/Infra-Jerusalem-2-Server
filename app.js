
import mongoose from 'mongoose';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes/acconutsRouts.js';
import { User } from './models/userModel.js';
// import accountRouts from './routes/acconutsRouts.js'
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors())
app.use(bodyParser.json());




routes(app, User, jwt, bcrypt);


app.get('/', (req, res) => {
    res.send('Hello Infra-jerusalem-2 Team! This is our Express server.');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app