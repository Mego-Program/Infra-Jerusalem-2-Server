export default async function forgetPassword(req,res)
{
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Find the user based on the email
      const user = await User.findOne({ email: email });

      if (!user) {
        // User not found for the provided email
        return res.status(404).send({ auth: false, message: "User not found" });
      }

      // Generate a unique reset token/code and save it to the user document
      const resetToken = generateResetToken();
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // Token expiry in 1 hour
      await user.save();

      // Send an email to the user with the resetToken and a link to the reset password page
      sendResetPasswordEmail(user.email, resetToken);

      // Respond with a success message (avoid disclosing if the email exists or not)
      res.status(200).send({ message: "Password reset instructions sent to your email." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ auth: false, message: "Forgot password failed." });
    }
  };
