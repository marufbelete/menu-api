const passport=require('passport')
const jwt = require("jsonwebtoken");

exports.loginFacebook=(req, res, next)=> {
    passport.authenticate('facebook', {session:false},(err, user, info) => {
      if (err || !user) {
        return res.status(301).json({auth:false})
      }
      var payload = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      const token=jwt.sign(payload,process.env.JWT_SECRET)
      res.cookie('token',token, { signed : true ,secure: true,httpOnly: true})
      return res.json({auth:true})
    })(req, res, next)
    
  }

exports.loginGoogle=(req, res, next)=> {
  passport.authenticate('google', {session:false},(err, user, info) => {
    console.log(user)
    console.log(info)
    if (err || !user) {
      return res.status(301).json({auth:false})
    }
    var payload = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    const token=jwt.sign(payload,process.env.JWT_SECRET)
    res.cookie('token',token, { signed : true ,secure: true,httpOnly: true})
    return res.json({auth:true})
  })(req, res, next)
  
}