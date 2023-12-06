const mongoose = require("mongoose");

const blacklistToken = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const blacklistTokenData = mongoose.model("blacklistTokenData", blacklistToken);

module.exports = blacklistTokenData;
