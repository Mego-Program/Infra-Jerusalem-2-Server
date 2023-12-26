import {
  getUserImg,
  getAllUsersInfo,
  getAllUserDetails,
  setImg,
} from "../controllers/userController.js";
import { validationResult, body } from "express-validator";
import {
  signinController,
  signupController,
} from "../controllers/acconuntsController.js";
import app from "../index.js";
import { verifyEmail, sendCode } from "../controllers/submitEmail.js";
import jwt from "jsonwebtoken";
import { googleLogin } from "../controllers/googleLogin.js";
import { sendEmailCode, verifyEmailCode, updatePassword } from "../controllers/forgotPassword.js";

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    req.body.name = decoded.name;
    next();
  });
}

function routes(app, User, jwt, bcrypt) {
  const signupValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("userName").notEmpty().withMessage("Last name is required"),
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

  const editProfileValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  app.post("/editProfile", verifyToken, editProfileValidation, editProfileController(User, bcrypt));

  app.get("/userDetails", verifyToken, getAllUserDetails);

  app.get("/allusersnameimg", getAllUsersInfo);

  app.post("/userNameImg", verifyToken, getUserImg);

  app.post("/sendemail", sendCode);

  app.post("/verifyemail", verifyEmail);

  app.post("/uploadimg", verifyToken, setImg);

  app.post("/sendemailcode", sendEmailCode);
  
  app.post("/verifyemailcode", verifyEmailCode);
  
  app.post("/updatepassword",verifyToken, updatePassword);
}

export default routes;
