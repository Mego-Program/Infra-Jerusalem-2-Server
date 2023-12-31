import { validationResult } from "express-validator";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";
import { verifyEmail, sendCode, codeFunc } from "./submitEmail.js";
import { Email } from "../models/emailModule.js";

export function signupController(User, jwt, bcrypt) {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { firstName, lastName, userName, password, email } = req.body;

      const verifyMail = await Email.find({email:email})
      console.log(verifyMail);
      

      if (!verifyMail){
        return res.status(200).send({message:"the user details hes seen good please verify your email"})
      }
      else{
        if (verifyMail.verify === false){
          return res.status(200).send({message:"the user details hes seen good please verify your email"})

        }
      }

      



      const userMail = await User.findOne({ email: email });
      if (userMail) {
        return res
          .status(500)
          .send({ auth: false, message: "The email already exists" });
      }



      const hashedPassword = bcrypt.hashSync(password, 8);

      const user = new User({
        firstName,
        lastName,
        userName,
        password: hashedPassword,
        email,
      });

      await user.save();

      res.status(200).send({ auth: true });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ auth: false, message: "User registration failed." });
    }
  };
}

export function signinController(User, jwt, bcrypt) {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).send({ auth: false, message: "User not found" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .send({ auth: false, message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user._id, name: user.userName},
        process.env.SECRET_KEY_TOKEN,
        { expiresIn: 100000 }
      );

      res.status(200).send({ auth: true, token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ auth: false, message: "Sign-in failed." });
    }
  };
}


export function editProfileController(User, bcrypt) {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { firstName, lastName, img, password, email } = req.body;

      const userMail = await User.findOne({ email: email });
      console.log(userMail);
      if (!userMail) {
        return res.status(500).send({ auth: false, message: "user not exist" });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

        userMail.firstName = firstName,
        userMail.lastName = lastName,
        userMail.password = hashedPassword,
        userMail.img = img ,
      
      await userMail.save();

      res.status(200).send({ auth: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ auth: false, message: "User registration failed." });
    }
  };
}


//============================

export function editShortProfileController(User) {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { firstName, lastName, email, img } = req.body;

      const userMail = await User.findOne({ email: email });
      console.log(userMail);
      if (!userMail) {
        return res.status(500).send({ auth: false, message: "user not exist" });
      }
console.log(img);
        userMail.firstName = firstName,
        userMail.lastName = lastName,
        userMail.img = img ,
      
      await userMail.save();

      res.status(200).send({ auth: true });
    } catch (error) {
      console.error(error);
      res.status(500).send({ auth: false, message: "User registration failed." });
    }
  };
}
