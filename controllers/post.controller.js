const PostPost = require("../models/post.model");
const sharp=require("sharp")
const fs=require("fs");
//for more than one file req.file will be chnaged in to req.files
exports.createPost=async (req, res, next) => {
    try {
      console.log("post")
        if(!!req.mimetypeError)
        {
            const error = new Error(req.mimetypeError)
            error.statusCode = 400
            throw error;
        }
    const imgurl=[]
    if (req.files.length > 0)
    {
        if (!fs.existsSync("./images")){
            fs.mkdirSync("./images");
        }
console.log(req.files.length)
  for(let f=0;f<req.files.length;f++)
  {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const imagetype=(req.files[f].mimetype).split("/")[1];
    const path=req.files[f].originalname;
    const fullpath=uniquePrefix+'-'+path;
           sharp(req.files[f].buffer)
          .resize({ width:600, fit: 'contain', })
    .toFormat(imagetype)
    .toFile(`./images/${fullpath}`);
    imgurl.push(fullpath)
 }

 const newpost = new PostPost({
    Catagory: req.body.catagory,
    Price:req.body.price,
    Description:req.body.description,
    ImageUrl:imgurl,
    
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
      const filter={}
        let catagory = !!req.query.catagory ? filter.Catagory=req.query.catagory:filter ;
        const catpost = await PostPost.find(filter).sort({"updated_At":-1})
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
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const imagetype=(req.files[f].mimetype).split("/")[1];
    const path=req.files[f].originalname;
    const fullpath=uniquePrefix+'-'+path;
           sharp(req.files[f].buffer)
          .resize({ width:600, fit: 'contain', })
    .toFormat(imagetype)
    .toFile(`./images/${fullpath}`);
    imgurl.push(fullpath)
 }

const updated=await PostPost.findByIdAndUpdate(id, 
  {$set:{ 
    Catagory: req.body.catagory,
    Price:req.body.price,
    Description:req.body.description,
    ImageUrl:imgurl,
  }
},{new:true})
   return res.json(updated)
}
else
{
  const updated=await PostPost.findByIdAndUpdate(id, 
    {$set:{ 
      Catagory: req.body.catagory,
      Price:req.body.price,
      Description:req.body.description,
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
        await PostPost.findByIdAndUpdate(req.params.id, {$set:{ IsActive: false }})
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