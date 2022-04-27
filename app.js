const express = require("express");
const mongoose = require("mongoose")
const app = express();
const passport=require('passport')
const User = require('./models/user.model')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const userroute = require('./routes/user.route');
const postroute = require('./routes/post.route');
const cookieParser=require('cookie-parser')
const cors=require('cors')
//with express-sesion
// app.use(session({
//       name: SESS_NAME,
//       secret: SESS_SECRET,
//       saveUninitialized: false,
//       resave: false,
//       store: new MongoStore({
//         mongooseConnection: mongoose.connection,
//         collection: 'session',
//         ttl: parseInt(SESS_LIFETIME) / 1000
//       }),
//       cookie: {
//         sameSite: true,
//         secure: NODE_ENV === 'production',
//         maxAge: parseInt(SESS_LIFETIME)
//       }
//     }));
app.use(cors({origin:'http://localhost:3000',credentials: true}))
app.use(express.json());
require('dotenv').config({path:".env"});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(userroute)
app.use(postroute)

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.BASE_SERVER_URL + '/facebook/callback',
  profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],
  passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      try{
        
        if (!profile._json.email) {
          done(null, false,{ message: 'Facebook Account is not registered with email. Please sign in using other methods' })
          }
        console.log(profile)
          console.log(profile._json.email)
          const emailexist = await User.findOne({
            email: profile._json.email,
          });
          if(!emailexist){
            const new_user=new User({
              email:profile._json.email,
              firstName:profile._json.first_name,
              lastName:profile._json.last_name,
              profileImage:profile._json.picture
            })
           await new_user.save()
          }
         done(null,{ email:profile._json.email,firstName:profile._json.first_name,lastName:profile._json.last_name,profileImage:profile._json.picture})

      }
        catch (err) {
          return done(null, null, {message: err})
      }
  })
}
  ));

 // Passport strategy for login via google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_SERVER_URL + '/google/callback',
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    try{
      if (!profile._json.email) {
        done(null, false,{ message: 'Google Account is not registered with email. Please sign in using other methods' })
        }
        console.log(profile._json.email)
        const emailexist = await User.findOne({
          username: profile._json.email,
        });

        done(null,{ email:profile._json.email,firstName:profile._json.first_name,lastName:profile._json.last_name,profileImage:profile._json.picture})
      }
    catch (err) {
      return done(null, null, {message: err})
  }
  })
}
 
  ));


mongoose.connect("mongodb+srv://maruf:12345@cluster0.nh1i5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,useUnifiedTopology: true 
})
mongoose.connection.on("error", err => {
  console.log("err please try again")
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
  app.listen(process.env.PORT, () => {
    console.log(`app is listening to PORT ${process.env.PORT}`)
  })

})



