const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
  hotelCity: {
    type: String,
  },
  cityCode: {
    type: String,
  },
  hotelCode: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const city = mongoose.model("city", CitySchema);

module.exports = city;
