const express = require('express');
const userauth = require("../middleware/auth.middleware")
const { saveUser } = require('../controllers/user.controller');
const { loginUser,updateUser } = require('../controllers/user.controller');
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();

router.post('/register', saveUser)
router.post('/login', loginUser,errorHandler)
router.post('/updateuser',userauth,updateUser)


module.exports = router

