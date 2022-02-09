const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    //post detail
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: {
        type: Array,
        trim: true,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
     brandName: {
         type: String,
         trim: true,
    },
  //location detail
    city: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    subCity: {
        type: String,
        trim: true,
        lowercase: true,
    },
    village: {
        type: String,
        trim: true,
        lowercase: true,
    },
//     //catagory detail
    firstCatagoryType: {
        type: String,
        trim: true,
        enum: ['sale', 'rent'],
        lowercase: true,
        required: true,
    },
    secondCatagoryType: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
 
},
  {
    timestamps: true,
  },
);


const PostPost = mongoose.model("post", PostSchema);

module.exports = PostPost;