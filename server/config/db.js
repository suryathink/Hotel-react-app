const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.set("strictQuery", true);

const LINK = process.env.LINK;

async function connectDatabase() {
  try {
    await mongoose.connect(LINK);
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
    console.error("Could not connect to the database");
  }
}

module.exports = connectDatabase;
