const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const blacklistTokenData = require("../models/blacklist");
const OTPModel = require("../models/otpModel");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


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
      // await OTPModel.deleteOne({ otp: otpRecord.otp });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error in OTP verification:", error);
    // throw new Error("Error in OTP verification");
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
  try {
    const alreadyExisting = await User.findOne({ email });

    if (alreadyExisting) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    let user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password),
    });

    user = user.toJSON();
    delete user.password;

    return {
      success: true,
      user,
      message: "User registration successful",
    };
  } catch (error) {
    console.error("Error in signup:", error);
    return {
      success: false,
      message: "Something went wrong during signup",
    };
  }
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

async function resetPassword(email, newPassword) {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // customized the response based on  frontend needs
      return {
        success: false,
        message: "User not found",
      };
    }

    // Update the user's password
    // password: bcrypt.hashSync(password),
    user.password = bcrypt.hashSync(newPassword);
   console.log("UpdatedUser",user)
    // Save the updated user object
    await user.save();

    return {
      success: true,
      message: "Password reset successful",
    };
  } catch (error) {
    console.error("Error in password reset:", error);
    throw new Error("Error in password reset");
  }
}

module.exports = {
  signup,
  login,
  verifyOTP,
  verifyToken,
  getUserById,
  addTokenToBlacklist,
  generateAndStoreOTP,
  resetPassword,
};
