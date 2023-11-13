import forgetPassword from "../controllers/accountsController";
const { validationResult, body } = require("express-validator");
const nodemailer = require("nodemailer"); // For sending emails


// function routes(app, User, jwt, bcrypt) {
//   // Validation for user signup
//   const signupValidation = [
//     // ... (existing signup validations)
//   ];

//   // Signup endpoint
//   app.post("/signup", signupValidation, async (req, res) => {
//     try {
//       // ... (existing signup logic)
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ auth: false, message: "User registration failed." });
//     }
//   });

//   // Validation for user signin
//   const signinValidation = [
//     // ... (existing signin validations)
//   ];

//   // Signin endpoint
//   app.post("/signin", signinValidation, async (req, res) => {
//     try {
//       // ... (existing signin logic)
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({ auth: false, message: "Sign-in failed." });
//     }
//   });

  // Validation for forgot password
  const forgotPasswordValidation = [
    body("email").isEmail().withMessage("Invalid email address"),
  ];

  // Forgot password endpoint
  app.post("/forgot-password", forgotPasswordValidation, forgetPassword(req,res))

  // TODO: Add a route to handle the password reset page where users can input a new password
  app.post("/reset-password", async (req, res) => {
    try {
      const { email, resetToken, newPassword } = req.body;

      // Find the user based on the email and reset token
      const user = await User.findOne({ email: email, resetToken: resetToken, resetTokenExpiry: { $gt: Date.now() } });

      if (!user) {
        // Invalid or expired reset token
        return res.status(400).send({ auth: false, message: "Invalid or expired reset token." });
      }

      // Update the user's password and clear the reset token fields
      const hashedPassword = bcrypt.hashSync(newPassword, 8);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      // Respond with a success message
      res.status(200).send({ auth: true, message: "Password reset successful." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ auth: false, message: "Password reset failed." });
    }
  });

  // TODO: Add more routes and logic here for future enhancements
  


module.exports = routes;

// Placeholder functions for generating reset tokens and sending reset password emails
function generateResetToken() {
  // Implement logic to generate a unique reset token or code
  return "unique_reset_token";
}

function sendResetPasswordEmail(email, resetToken) {
  // Implement logic to send an email with the reset token and a link to the reset password page
  const transporter = nodemailer.createTransport({
    // Configure your email sending service
    // Example for sending via Gmail:
    // service: "gmail",
    // auth: {
    //   user: "your-email@gmail.com",
    //   pass: "your-email-password",
    // },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: http://your-app/reset-password?token=${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email sending error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
