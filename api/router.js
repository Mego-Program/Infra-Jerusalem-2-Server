import { validationResult, body } from "express-validator";

function routes(app, User, jwt, bcrypt) {
  const signupValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  app.post("/signup", signupValidation, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        
        return res.status(400).json({ errors: errors.array() });
      }
      const { firstName, lastName, password, email } = req.body;
      console.log(req.body)

      const userMail = await User.findOne({ email: email });
      if (userMail) {
        console.log('he email already exists')
        return res
          .status(500)
          
          .send({ auth: false, message: "The email already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      const user = new User({
        firstName,
        lastName,
        password: hashedPassword,
        email,
      });

      await user.save();

 

      res.status(200).send({ auth: true });
    } catch (error) {
      console.error(error);

      res.status(500).send({ auth: false, message: "User registration failed." });
    }
  });

  const signinValidation = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];

  app.post("/signin", signinValidation, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
  

      const user = await User.findOne({ email: email });
      console.log(user)

      if (!user) {
        return res.status(404).send({ auth: false, message: "User not found" });
      }
      const hashedPassword = bcrypt.hashSync(password, 8);
      console.log(hashedPassword)
      const isPasswordValid = hashedPassword && user.password;
      console.log(isPasswordValid)


      if (!isPasswordValid) {
        return res.status(401).send({ auth: false, message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user._id, name: user.firstName + " " + user.lastName },
        "secret",
        { expiresIn: 100000 }
      );

      res.status(200).send({ auth: true, token });
    } catch (error) {
      console.error(error);
      res.status(500).send({ auth: false, message: "Sign-in failed." });
    }
  });
}

export default routes;
