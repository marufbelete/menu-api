const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

//signup
exports.saveUser = async (req, res, next) => {
  try {
    console.log(req.body)
    const name=req.body.name
    const email= req.body.email
    const password=req.body.password
    const confirm_password=req.body.confirmPassword
   
    if (!email || !password) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error; 
    }
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
      const anyusername = await User.findOne({
      Email:email,
    });
    if (anyusername) {
      const error = new Error("user-name is already in use")
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
      Name:name,
      Email: email,
      Password: passwordHash,
    })
    await user.save()
    const token = jwt.sign({ sub: user._id, email: user.Email },process.env.JWT_SECRET);
    res.cookie('token',token,{httponly:true,signed:true})
    console.log(res)
    return res.json({auth:true});
  }
  catch(error) {
    next(error)
  }
};

//log in
exports.loginUser = async (req, res, next) => {
  try {
    
    const email=req.body.email;
    const password = req.body.password
    if (!email || !password) {
      return res.status(400).json("Please fill all field.")
    }
    const user = await User.findOne({
      Email: email,
    });
    if (!user) {
      const error = new Error("No account with this user-name exist")
      error.statusCode = 400
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.Password)
    if (!isMatch) {
      const error = new Error("Invalid credential.")
      error.statusCode = 400
      throw error;
    }
    const token = jwt.sign({ sub: user._id,email: user.Email }, process.env.JWT_SECRET);
    res.cookie('token',token,{httponly:true,signed:true})
    console.log(res)
    return res.json({auth:true});
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
if (name) {
     updateinfo.Name=name
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
    updateinfo.Password=passwordHash
  }
  updateinfo={$set:updateinfo}
  console.log(updateinfo)
  const updated = await User.findByIdAndUpdate(id,updateinfo)
   res.json(updated)
  }
  catch(error) {
    next(error)
  }
};
