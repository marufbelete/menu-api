const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    //post detail
    Catagory: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    Price: {
        type: Number,
        trim: true,
        required: true,
    },
    Description: {
        type: String,
        trim: true,
    },
    ImageUrl: {
        type: [String],
        trim: true,
        required: true,
    },
IsActive: {
        type: Boolean,
        default: true,
    },
},
  {
    timestamps: true,
  },
);


const PostPost = mongoose.model("post", PostSchema);

module.exports = PostPost;