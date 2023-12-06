const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { generateAndStoreOTP } = require("../controllers/authController");
const {
  signup,
  login,
  addImage,
  addTokenToBlacklist,
  verifyOTP,
} = require("../controllers/authController");
const authorization = require("../middlewares/authorization");
const User = require("../models/userModel");
dotenv.config();

const authRouter = express.Router();

authRouter.get("/", async (req, res) => {
  try {
    return res.status(201).send({
      message: "Hello From Backend",
    });
  } catch (err) {
    return res.status(400).send({
      error: "Error Happened in Backend",
    });
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await signup(name, email, password);

    return res.status(201).send({
      message: "Registration Successful, Please Login",
      data: user,
    });
  } catch (err) {
    let errorMessage = "Something went wrong";

    if (err.message === "User already exists") {
      errorMessage = "User already exists,";
    }

    return res.status(400).send({
      error: errorMessage,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await login(email, password);

    return res.send({
      message: "Login Successfull",
      data,
    });
  } catch (err) {
    let errorMessage =
      "Something went wrong, Either Email or password is Wrong" +
      "  " +
      err.message;

    if (err.message === "password does not match") {
      errorMessage = "Password Does Not Match";
    } else if (err.message === "User Already Present") {
      errorMessage = "User with this email Does Not Exist";
    }

    return res.status(401).send({
      error: errorMessage,
    });
  }
});

// Modify the existing /forgot-password route
authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User with this email does not exist");
      return res.status(404).send({
        error: "User with this email does not exist",
      });
    }

    // Generate and store OTP
    const otp = await generateAndStoreOTP(email);

    // Send the OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "singhsuryaprakash110@gmail.com",
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const mailOptions = {
      from: "singhsuryaprakash110@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({
          error: "Failed to send OTP via email",
        });
      }

      console.log("Email sent:", info.response);
      return res.status(200).send({
        message: "OTP sent successfully",
        email: user.email, // Send the email as a response
      });
    });
  } catch (err) {
    console.error("Inside catch part of forgot-password:", err);
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
});

// Add this route to your authRouter
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Call a function to verify the OTP
    const isOTPValid = await verifyOTP(email, otp);

    if (isOTPValid) {
      return res.status(200).send({
        message: "OTP verified successfully",
        email: email, // Send the email as a response
      });
    } else {
      return res.status(401).send({
        error: "Invalid OTP",
      });
    }
  } catch (err) {
    console.error("Error in OTP verification:", err);
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
});

//  Reset password route
authRouter.post("/reset-password", async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    // Verify OTP
    const isOTPValid = await verifyOTP(userId, otp);

    if (!isOTPValid) {
      return res.status(401).send({
        error: "Invalid OTP",
      });
    }

    // Reset password
    await resetPassword(userId, newPassword);

    return res.status(200).send({
      message: "Password reset successful",
    });
  } catch (err) {
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const data = await addTokenToBlacklist(token);

    return res.send({
      message: "Logout Successful",
      data,
    });
  } catch (err) {
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
});

module.exports = authRouter;
