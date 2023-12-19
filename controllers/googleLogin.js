
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const googleLogin = async (req, res) => {
  try {
    const {googleToken} = req.headers.authorization;
    

    if (googleToken) {
        const decodedToken = jwt.decode(googleToken);
      const {  email, name, picture,given_name,family_name } = decodedToken


      const userMail = await User.findOne({ email: email });
      if (userMail) {

        const token = jwt.sign(
            { id: user._id, name: user.userName},
            process.env.SECRET_KEY_TOKEN,
            { expiresIn: 100000 }
          );



        return res
          .status(200)
          .send({ auth: true, token});
      }



      const hashedPassword = "hbgfcuyguihughvghvjhb";

      const user = new User({
        firstName:given_name,
        lastName:family_name,
        userName:name,
        password: hashedPassword,
        img:picture,
        email,
      });

      const token = jwt.sign(
        { id: user._id, name: name},
        process.env.SECRET_KEY_TOKEN,
        { expiresIn: 100000 }
      );

      await user.save();


    





      res.status(200).json({ token });
    } else {

      res.status(400).json({ error: "Invalid Google token" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { googleLogin };
