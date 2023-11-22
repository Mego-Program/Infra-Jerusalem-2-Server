import {getUserImg,getAllUsersInfo} from '../controllers/userController.js'
import { validationResult, body } from "express-validator";
import { signinController, signupController } from "../controllers/acconuntsController.js";
import app from '../index.js';

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
      req.userName = decoded.userName;
      next();
    });
  }




 function routes(app, User, jwt, bcrypt) {
  const signupValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  app.post("/signup", signupValidation, signupController(User, jwt, bcrypt));

  const signinValidation = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  app.post("/signin", signinValidation, signinController(User, jwt, bcrypt));


  app.get('/allUsersNameImg',getAllUsersInfo)


app.post('/userNameImg',verifyToken,getUserImg)
}




export default routes