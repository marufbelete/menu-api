const mongoose = require("mongoose");

const CatagorySchema = new mongoose.Schema({
//sale or rent
  firstCatagoryType: {
    type: String,
    trim: true,
    enum : ['sale','rent'], 
    lowercase:true,
    required: true,
    unique:[true,"the catagory must be unique"]
  },
  secondCatagoryType: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    unique:[true,"the catagory must be unique"]
  },
  secondCatagoryImage: {
     type: String,
     required: true,
    }
},
    {
        timestamps: true,
    },
);


const CatagoryPost = mongoose.model("Catagorypost", CatagorySchema);

module.exports = CatagoryPost ;