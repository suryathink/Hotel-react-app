const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const blacklistTokenData = require("../models/blacklist");
const OTPModel = require("../models/otpModel");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "singhsuryaprakash@gmail.com", // replace with your email
    pass: process.env.GOOGLE_PASSWORD, // replace with your password
  },
});

// authController.js

async function generateAndStoreOTP(email) {
  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP in the database, associating it with the user
    await OTPModel.create({
      email,
      otp,
      createdAt: new Date(),
    });

    return otp;
  } catch (error) {
    console.log("Error Happened Inside generateAndStoreOTP", error);
  }
}
async function verifyOTP(email, enteredOTP) {
  try {
    const OTP_EXPIRY_DURATION = 10 * 60 * 1000;
    // Retrieve the stored OTP for the email from the database
    const otpRecord = await OTPModel.findOne({
      email,
      otp: enteredOTP,
    });

    // Check if OTP is valid and not expired
    if (
      otpRecord &&
      otpRecord.createdAt > new Date(Date.now() - OTP_EXPIRY_DURATION)
    ) {
      //  delete the OTP record from the database after successful verification
      await OTPModel.deleteOne({ otp: otpRecord.otp }); //  TODO Check What mistake you are doing
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in OTP verification:", error);
    throw new Error("Error in OTP verification");
  }
}

function generateToken(user) {
  let payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
  console.log(payload);
  return jwt.sign(payload, JWT_SECRET);
}

function verifyToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}

async function signup(name, email, password) {
  const alreadyExisting = await User.findOne({
    email,
  });

  if (alreadyExisting) {
    throw new Error("User already exists");
  }
  let user = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password),
  });
  user = user.toJSON();

  delete user.password;

  return user;
}

async function login(email, password) {
  let user = await User.findOne({
    email,
  });
  if (user) {
    user = user.toJSON();
    if (bcrypt.compareSync(password, user.password)) {
      delete user.password;
      return {
        data: {
          token: generateToken(user),
          user,
        },
      };
    } else {
      throw new Error("password does not match");
    }
  } else {
    throw new Error("User Already Present");
  }
}

async function getUserById(id) {
  let user = await User.findById(id);

  user = user.toJSON();
  delete user.password;
  return user;
}

async function addTokenToBlacklist(token) {
  let blacklisted = await blacklistTokenData.create({ token });

  return blacklisted;
}

module.exports = {
  signup,
  login,
  verifyOTP,
  verifyToken,
  getUserById,
  addTokenToBlacklist,
  generateAndStoreOTP,
};
