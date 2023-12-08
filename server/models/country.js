const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema({
  hotelCountry: {
    type: String,
  },
  countryCode: {
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

const Country = mongoose.model("Country", CountrySchema);

module.exports = Country;
