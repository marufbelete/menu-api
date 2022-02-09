const PostPost = require("../models/post.model");
const LocationPost = require("../models/location.model");

const sharp=require("sharp")
const fs=require("fs");
//for more than one file req.file will be chnaged in to req.files
exports.createPost=async (req, res, next) => {
    try {
        if(!!req.mimetypeError)
        {
            const error = new Error(req.mimetypeError)
            error.statusCode = 400
            throw error;
        }
    const imgurl=[]
    if (req.files.length > 0)
    {
        if (!fs.existsSync("../images")){
            fs.mkdirSync("../images");
        }
console.log(req.files.length)
  for(let f=0;f<req.files.length;f++)
  {
    console.log(req.files[f])
    const imagetype=(req.files[f].mimetype).split("/")[1]
    const path=req.files[f].originalname
           sharp(req.files[f].buffer)
          .resize({ width:200, fit: 'contain', })
    .toFormat(imagetype)
    .toFile(`./images/${path}`);
    imgurl.push(path)
 }

 const isexist = await LocationPost.find({
    city: req.body.city,
    subCity: req.body.subcity,
    village: req.body.village
})
if (isexist.length === 0) {
    // save non exsting location
    const location = new LocationPost({
        city: req.body.city,
        subCity: req.body.subcity,
        village: req.body.village
    })
  await location.save()

}
 const newpost = new PostPost({
    firstCatagoryType: req.body.firstcat,
    secondCatagoryType: req.body.secondcat,
    price:req.body.price,
    description:req.body.description,
    imageUrl:imgurl,
    brandName:req.body.brandname,
    city:req.body.city,
    subCity:req.body.subcity,
    village:req.body.village,
    
  })
     const post=await newpost.save()
     res.json(post)
    }
  else{
    const error = new Error("you should have an attachment")
    error.statusCode = 400
    throw error;
  }
    }
  catch(error) {
    next(error)
  }
}
//get all post
exports.getPost = async (req, res, next) => {
    try {

        let page = !!req.query.pageno ? req.query.pageno : 0
        let pagesize = 10
        let skip = pagesize * page

        let conditions = [{firstCatagoryType:req.params.firstcatagory,secondCatagoryType:req.params.secondcatagory}];
        let location = !!req.query.location ? req.query.location : "addis ababa";
        let price = !!req.query.price ? req.query.price : !!req.query.price;
        let brandname = !!req.query.brandname ? req.query.brandname : !!req.query.brandname;

        if (location) {
            conditions.push({ $or: [{ village: location }, { city: location }] });
        }
        if (price) {
            conditions.push({ price: { $lte: price } });
        }
        if (brandname) {
            conditions.push({ brandName: brandname });
        }
        let final_condition = { $and: conditions };

        const catpost = await PostPost.find(final_condition).limit(pagesize).skip(skip).sort({"updated_At":-1})
        return res.json(catpost)
    }
    catch(error) {
        next(error)
      }
}
// update post edit
exports.updatePost = async (req, res, next) => {
    try {
      if(!!req.mimetypeError)
      {
          const error = new Error(req.mimetypeError)
          error.statusCode = 400
          throw error;
      }
        const imgurl=[]
        const id =req.params.id
        if (req.files.length > 0)
       {
        if (!fs.existsSync("../images")){
            fs.mkdirSync("../images");
        }
  for(let f=0;f<req.files.length;f++)
  {
    console.log(req.files[f])
    const imagetype=(req.files[f].mimetype).split("/")[1]
    const path=req.files[f].originalname
           sharp(req.files[f].buffer)
          .resize({ width:200, fit: 'contain', })
    .toFormat(imagetype)
    .toFile(`./images/${path}`);
    imgurl.push(path)
 }

 const isexist = await LocationPost.find({
    city: req.body.city,
    subCity: req.body.subcity,
    village: req.body.village
})
if (isexist.length === 0) {
    // save non exsting location
    const location = new LocationPost({
        city: req.body.city,
        subCity: req.body.subcity,
        village: req.body.village
})
  await location.save()
}
const updated=await PostPost.findByIdAndUpdate(id, 
  {$set:{ 
    firstCatagoryType: req.body.firstcat,
    secondCatagoryType: req.body.secondcat,
    price:req.body.price,
    description:req.body.description,
    imageUrl:imgurl,
    brandName:req.body.brandname,
    city:req.body.city,
    subCity:req.body.subcity,
    village:req.body.village,
  }
},{new:true})
   return res.json(updated)
}
else
{
  const updated=await PostPost.findByIdAndUpdate(id, 
    {$set:{ 
      firstCatagoryType: req.body.firstcat,
      secondCatagoryType: req.body.secondcat,
      price:req.body.price,
      description:req.body.description,
      brandName:req.body.brandname,
      city:req.body.city,
      subCity:req.body.subcity,
      village:req.body.village,
    }
  })
  res.json(updated)
}     
    }
    catch(error) {
        next(error)
      }
}
//update status
exports.closePost = async (req, res, next) => {
    try {
        await PostPost.findByIdAndUpdate(req.params.id, {$set:{ isActive: false }})
        res.json("sucessfully updated")
    }
    catch(error) {
        next(error)    
    }
}
//
exports.renewPost = async (req, res, next) => {
  try {
      await PostPost.findByIdAndUpdate(req.params.id, {$set:{ isActive:true}})
      res.json("sucessfully updated")
  }
  catch(error) {
      next(error)    
  }
}
//delete post
exports.deletePost = async (req, res, next) => {
    try {
        const id = req.params.id
        await PostPost.findByIdAndDelete(id)
        res.json("deleted sucessfully")
    }
    catch(error) {
        next(error)
      }

}