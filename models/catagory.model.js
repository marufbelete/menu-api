const mongoose = require("mongoose");

const CatagorySchema = new mongoose.Schema({
  Catagory: {
    type: String,
    trim: true,
    lowercase:true,
    required: true,
    unique:[true,"the catagory must be unique"]
  },
  CatagoryImage:{
    type: String,
    trim: true,
    lowercase:true,
    required: true,
  }
},
    {
        timestamps: true,
    },
);


const CatagoryPost = mongoose.model("Catagorypost", CatagorySchema);

module.exports = CatagoryPost ;