const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const secret=require('../config.json')

//signup
exports.saveUser = async (req, res, next) => {
  try {
    const username= req.body.username
    const password=req.body.password

    if (!!!username || !!!password) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error;
      
    }
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
      const anyusername = await User.findOne({
      username: username,
    });
    if (anyusername) {
      const error = new Error("user-name is already in use")
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
      username: username,
      password: passwordHash,
    })
    await user.save()
    const token = jwt.sign({ sub: user._id, username: user.username },secret.SECRET);
    return res.json({
      token
    });
  }
  catch(error) {
    next(error)
  }
};

//log in
exports.loginUser = async (req, res, next) => {
  try {
    console.log("login")
    const username=req.body.username;
    const password = req.body.password
    if (!!!username || !!!password) {
      return res.status(400).json("Please fill all field.")
    }
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      const error = new Error("No account with this user-name exist")
      error.statusCode = 400
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error("Invalid credential.")
      error.statusCode = 400
      throw error;
    }
    const token = jwt.sign({ sub: user._id, username: user.username }, secret.SECRET);
    res.json({
      token
    });
  }
  catch(error) {
    next(error)
  }
};
//update user info
exports.updateUser = async (req, res, next) => {
  try {
    const name = req.body.name
    const password=req.body.password
    const confirm_password= req.body.confirm_password
    const id=req.user.sub;
    let passwordHash
    let updateinfo={}
if (!!name) {
     updateinfo.name=name
    }
if(!!password)
{
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    if (password !== confirm_password) {
      const error = new Error("password doesn't match. please try again.")
      error.statusCode = 400
      throw error;
    }
  
    const salt = await bcrypt.genSalt();
    passwordHash = await bcrypt.hash(password, salt);
    updateinfo.password=passwordHash
  }
  console.log(id)
  console.log(updateinfo)
  updateinfo={$set:updateinfo}
  console.log(updateinfo)
  
  const updated = await User.findByIdAndUpdate(id,updateinfo)
   res.json(updated)
  }
  catch(error) {
    next(error)
  }
};
