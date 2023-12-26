import nodemailer from "nodemailer";
import { Email } from "../models/emailModule.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const codeFunc = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

const sendEmailCode = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  console.log(email);

  try {
    let code = codeFunc();

    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res
        .status(500)
        .send({ auth: false, message: "The email not exists" });
    }

    const userMail = await Email.findOne({ email: email });
    if (userMail) {
        await Email.deleteOne({ _id: userMail._id });
    }
    const userEmail = new Email({
      email: email,
      code: code,
      verify: false,
    });
    await userEmail.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "infrajerusalem@gmail.com",
        pass: process.env.PASSWORD_EMAIL,
      },
    });

    const mailOptions = {
      from: "infrajerusalem@gmail.com",
      to: email,
      subject: "Code",
      text: "The code is " + code,
    };
    console.log(mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    console.log("Email sent:", info.messageId);
    return res.status(200).send({ "Email sent:": info.messageId });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(401).send("Email not send");
  }
};
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ auth: false, message: "User not found" });
    }

    const userMail = await Email.findOne({ email: email });
    console.log(userMail, code);

    if (userMail.code == code) {
      userMail.verify = true;
      userMail.save();
      const token = jwt.sign(
        { id: user._id, name: user.userName },
        process.env.SECRET_KEY_TOKEN,
        { expiresIn: 100000 }
      );

      return res.status(200).send({ auth: true, token });
    } else {
      return res.status(401).send("email not valid");
    }
  } catch (error) {
    return res.status(500).send("problem with chaeking email");
  }
};

const updatePassword = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ userName: name });

    if (!user) {
      return res.status(500).send({ auth: false, message: "user not exist" });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);

    console.log(hashedPassword);

    user.password = hashedPassword;
    console.log(user);

    await user.save();

    return res.status(200).send("password update successfully");
  } catch (error) {
    console.log(error);
  }
};

export { sendEmailCode, verifyEmailCode, updatePassword, codeFunc };
