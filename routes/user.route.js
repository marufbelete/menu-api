const express = require('express');
const passport=require('passport')
const userauth = require("../middleware/auth.middleware")
const { loginUser,updateUser,saveUser } = require('../controllers/user.controller');
const {loginFacebook,loginGoogle}=require('../passportAuth/auth')
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();

router.post('/register', saveUser,errorHandler)
router.post('/login', loginUser,errorHandler)
router.post('/updateuser',userauth,updateUser,errorHandler)

// Facebook authentication strategy
router.use('/auth/facebook',   passport.authenticate('facebook', {scope:['email']}))
router.get('/facebook/callback',loginFacebook)
// router.get('/facebook/delete', authController.deleteFacebookData)

// // Google authentication strategy
router.use('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))
router.get('/google/callback',loginGoogle)
// router.get('/api/google/delete', authController.deleteGoogleData)


module.exports = router

