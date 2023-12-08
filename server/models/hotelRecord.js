const mongoose = require("mongoose");

// const HotelSchema = mongoose.Schema({
//   hotelCode: {
//     type: String,
//   },
//   hotelName: {
//     type: String,
//   },
//   cityCode: {
//     type: String,
//   },
//   countryCode: {
//     type: String,
//   },
// });

const hotelSchema = new mongoose.Schema({
  hotelCode: {
    type: String,
    unique: true,
    default: null,
  },
  hotelName: {
    type: String,
  },
  cityCode: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  // Other fields...
});

hotelSchema.pre("save", async function (next) {
  try {
    if (!this.hotelCode) {
      const lastHotel = await this.constructor.findOne(
        {},
        {},
        { sort: { created_at: -1 } }
      );
      const lastNumber = lastHotel
        ? parseInt(lastHotel.hotelCode.match(/\d+/)[0])
        : 0;
      this.hotelCode = `EL${lastNumber + 1}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});
//
// const Hotel = mongoose.model("Hotel", hotelSchema);

const HotelData = mongoose.model("HotelData", hotelSchema);

module.exports = HotelData;
