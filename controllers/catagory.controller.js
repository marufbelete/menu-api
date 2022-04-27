const CatagoryPost = require("../models/catagory.model");
const sharp=require("sharp")
const fs=require("fs");
// for admin
exports.createCatagory=async (req, res, next) => {
    try {
        const catagory=req.body.catagory
        if(!!req.mimetypeError)
        {
            return res.json(req.mimetypeError)
        }
        if(!!req.file)
        {
            if (!fs.existsSync("../images"))
             {
                fs.mkdirSync("../images");
            }
            const imagetype = (req.file.mimetype).split("/")[1]
            const path = req.file.originalname
            await sharp(req.file.buffer)
                .resize({ width: 200, fit: 'contain', })
                .toFormat(imagetype)
                .toFile(`./images/${path}`);
                const newcatagory=new CatagoryPost(
                {
                    firstCatagoryType: first_catagory,
                    secondCatagoryType:second_catagory,
                    secondCatagoryImage: path
                })
                newcatagory.save()

              return res.json(savedorupdatecat)        
    }
    else{
       const error = new Error("please add an image attachment for the catagory")
       error.statusCode = 400
       throw error;
    }
    }
    catch(error) {
       next(error)
    }
}
//for all
exports.getCatgory = async (req, res, next) => {
    try {
        const all_catagory = await CatagoryPost.find()
        res.json(all_catagory)
    }
    catch(error) {
       next(error)
    }
}
// for admin update
exports.updateCatagory = async (req, res,next)=> {
    try {
        if(!!req.mimetypeError)
        {
           return res.json(req.mimetypeError)
        }
        let path
        if(!!req.file)
        {
            console.log(req.file.buffer)
            if (!fs.existsSync("../images")) {
                fs.mkdirSync("../images");
            }
           
            const imagetype = (req.file.mimetype).split("/")[1]
            path = req.file.originalname
            if (!fs.existsSync(`./images/${path}`)) {
                await sharp(req.file.buffer)
                    .resize({ width: 200, fit: 'contain', })
                    .toFormat(imagetype)
                    .toFile(`./images/${path}`);
            }
            // save non exsting catagory
            const catagory = await CatagoryPost.findByIdAndUpdate(req.params.id, {
                $set: {
                Catagory: req.body.catagory,
                CatagoryImage:path
                }
                }, {useFindAndModify: false,new:true})
    
               return catagoryres.json(catagory)
        }
        else
        { 
            const catagory = await CatagoryPost.findByIdAndUpdate(req.params.id, {
                $set: {
                    Catagory: req.body.catagory,
                }
                }, {useFindAndModify: false,new:true})
    
              return res.json(catagory)
        }
    }
    catch(error) {
       next(error)
    }
}
// for admin delete
exports.deleteCatagory = async (req, res, next) => {
    try {
        await CatagoryPost.findByIdAndDelete(req.params.id)
        res.json("deleted succssfully")
    }
    catch(error) {
     next(error)
    }
}