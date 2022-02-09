const  Payment= require("../models/payment.model");

//add ussdCode
exports.addUssdCode = async (req, res, next) => {

  try {
  const ussd=await Payment.find()
  console.log(ussd)
  if(ussd.length===0)
  {
const newussd=new Payment({
  ussdCode:req.body.ussdcode,
  phoneNumber:req.body.phonenumber,
  amount:req.body.amount
})
const savedussd=await newussd.save()
res.json(savedussd)
}
else{
  const error = new Error("Ussdcode already exists,you can't have more than one Ussdcode for now but you can update the value if you want")
  error.statusCode = 400
  throw error;
}
  }
  catch(error) {
    next(error)  
}
}
//get ussdcode
exports.getUssdCode = async (req, res, next) => {
  try {
const ussd=await Payment.findOne()
res.json(ussd)
  }
  catch{
next(error)
  }
}
//update ussdcode
exports.updateUssdCode = async (req, res, next) => {
  try {
const ussd=await Payment.findByIdAndUpdate(req.params.id,{
  $set:{
  ussdCode:req.body.ussdcode,
  phoneNumber:req.body.phonenumber,
  amount:req.body.amount
  }
},{new:true})
res.json(ussd)
  }
  catch(error) {
next(error)
  }
}

//delete ussdcode
exports.deleteUssdCode = async (req, res, next) => {
  try {
await Payment.findByIdAndDelete(req.params.id)
res.json("Deleted Successfully")
  }
  catch(error){
next(error)
  }
}
