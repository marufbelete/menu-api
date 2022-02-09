const LocationPost = require("../models/location.model");

//for all
exports.createLocation=async (req, res, next) => {
    try {
        console.log(req.body)
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

           const newlocation= await location.save()
           return res.json(newlocation)
        }
        else {
            const error = new Error("This location already exist")
            error.statusCode = 400
            throw error;
        }
    }

  catch(error) {
       next(error)
  }
}

//for all
exports.getLocation=async(req,res,next)=>{
  try{
      const location = await LocationPost.find()
      res.json(location)
    
  }
  catch(error){
     next(error)
  }

}
//get city
exports.getCity=async(req,res,next)=>{
    try{
        const location = await LocationPost.find().select("city").distinct("city")
        res.json(location)
      
    }
    catch(error){
  next(error)
    }
  }
  //get subcity
exports.getSubcity=async(req,res,next)=>{
    try{
        const location = await LocationPost.find({city:"addis ababa"},{subCity:1,}).distinct("subCity")
        res.json(location)
      
    }
    catch(error){
        next(error)
          }
  }
//get village
exports.getVillage=async(req,res,next)=>{
    try{
        let conditions = [{city:req.params.city}];
        let subcitys = !!req.query.subcity ? req.query.subcity : !!req.query.subcity;

        if (subcitys) {
            conditions.push({subCity:subcitys });
            console.log(subcitys)
        }
        console.log(req.params.city)
        let final_condition = { $and: conditions };
        console.log(final_condition)
        const location = await LocationPost.find(final_condition).select("village").distinct("village")
        res.json(location)
      
    }
    catch(error){
        next(error)
          }
  }
//update location info
exports.updateLocation=async(req,res,next)=>{
    try{
        const location = await LocationPost.findByIdAndUpdate(req.params.id, {
            $set: {
                city: req.body.city,
                subCity: req.body.subcity,
                village: req.body.village
            }
            })
        res.json(location) 
    }
    catch(error){
        next(error)
          }
         }

// for admin delete
exports.deleteLocation = async (req, res, next) => {
    try {
        await LocationPost.findByIdAndDelete(req.params.id)
        res.json("deleted succssfully")

    }
    catch(error) {
        next(error)
    }
}