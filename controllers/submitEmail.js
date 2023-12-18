import nodemailer from "nodemailer";
import { Email } from "../models/emailModule.js";

const codeFunc = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

const sendCode = async (req, res) => {
  const { email } = req.body;

  try {
    let code = codeFunc();

    const userMail = await Email.findOne({ email: email });
    if (userMail) {
      return res
        .status(500)
        .send({ auth: false, message: "The email already exists" });
    }
    const setEmail = new Email({
      email: email,
      code: code,
      verify:false,
    });
    await setEmail.save();


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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return res.status(200).send({"Email sent:": info.messageId})
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(401).send("Email not send")

  }
};
const verifyEmail = async (req, res) => {
  const {email, code } = req.body;
  try{
  const userMail = await Email.findOne({ email: email });

  if (userMail.code === code){
    userMail.verify = true
    userMail.save()
    return res.status(200).send("email valid")


  }
  else{
    return res.status(401).send("email not valid")


  }
  }
  catch(error){
    return res.status(500).send("problem with chaeking email")

  }


};

export { verifyEmail, sendCode, codeFunc };
