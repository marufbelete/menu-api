const express = require('express');
const userauth = require("../middleware/auth.middleware")
const { createPost,getPost,closePost,renewPost,deletePost,updatePost } = require('../controllers/post.controller')
const {createCatagory,getCatgory,updateCatagory,deleteCatagory} = require('../controllers/catagory.controller')
const {createLocation,getLocation,updateLocation,deleteLocation,getCity,getSubcity,getVillage} = require('../controllers/location.controller')
const {addUssdCode,getUssdCode,updateUssdCode,deleteUssdCode,}=require('../controllers/payment.controller')
const {errorHandler} = require('../middleware/errohandling.middleware')
const multer=require("multer");
const router = express.Router();
const fileStorage = multer.memoryStorage()

// file compression
const filefilter = (req, file, cb) => {
    console.log("filter")
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  }
  else {
    const type=file.mimetype.split("/")[1]
    req.mimetypeError=`${type} file is not allowed please attach only image file`;
    cb(null, false,new Error(`${type} file is not allowed please attach only image file`))
    
  } 
}
const upload=multer({ storage: fileStorage, fileFilter: filefilter })

//post
router.post('/createpost', userauth,upload.array('image',6),createPost,errorHandler)
router.get('/getpost/:firstcatagory/:secondcatagory', userauth,getPost,errorHandler)
router.put('/updatepost/:id',upload.array('image',6), userauth,updatePost,errorHandler)
router.put('/updatepoststatus/:id', userauth,closePost,errorHandler)
router.put('/updatepoststatus/:id', userauth,renewPost,errorHandler)
router.delete('/deletepost/:id', userauth,deletePost,errorHandler)

//catagory
router.post('/createcatagory', userauth,upload.single('image'),createCatagory,errorHandler)
router.get('/getcatagory', userauth,getCatgory,errorHandler)
router.put('/updatecatagory/:id',upload.single('image'), userauth,updateCatagory,errorHandler)
router.delete('/deletecatagory/:id', userauth,deleteCatagory,errorHandler)

//location
router.post('/addlocation', userauth,createLocation,errorHandler)
router.get('/getlocation', userauth,getLocation,errorHandler)
router.get('/getcity', userauth,getCity,errorHandler)
router.get('/getsubcity', userauth,getSubcity,errorHandler)
router.get('/getvillage/:city', userauth,getVillage,errorHandler)
router.put('/updatelocation/:id', userauth,updateLocation,errorHandler)
router.delete('/deletelocation/:id', userauth,deleteLocation,errorHandler)
//ussd code
router.post('/createussdcode', userauth,addUssdCode,errorHandler)
router.get('/getussdcode', userauth,getUssdCode,errorHandler)
router.put('/updateussdcode/:id', userauth,updateUssdCode,errorHandler)
router.delete('/deleteussdcode/:id', userauth,deleteUssdCode,errorHandler)

module.exports = router

