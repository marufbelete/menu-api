const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    trim: true,
  },
  Email: {
    type: String,
    trim: true,
    required: true,
  },
  Password: {
    type: String,
    trim: true,
    required: true,
  },
},
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", UserSchema);

module.exports = User;