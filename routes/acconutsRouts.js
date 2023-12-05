import { validationResult, body } from "express-validator";
import { signinController, signupController } from "../controllers/acconuntsController.js";

export function routes(app, User, jwt, bcrypt) {
  const signupValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("userName").notEmpty().withMessage("user name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isStrongPassword().withMessage("Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols"),
  ];

  app.post("/signup", signupValidation, signupController(User, jwt, bcrypt));

  const signinValidation = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isStrongPassword().withMessage("Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols"),
  ];

  app.post("/signin", signinValidation, signinController(User, jwt, bcrypt));
}


