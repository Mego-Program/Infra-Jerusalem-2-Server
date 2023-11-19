import { validationResult } from "express-validator";


export function signupController(User, jwt, bcrypt) {
  return async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { firstName, lastName, password, email } = req.body;

      const userMail = await User.findOne({ email: email });
      if (userMail) {
        return res.status(500).send({ auth: false, message: "The email already exists" });
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
      console.log(user)

      if (!user) {
        return res.status(404).send({ auth: false, message: "User not found" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

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
  };
}

