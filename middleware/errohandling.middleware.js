
exports.errorHandler = (err,req,res,next) =>{
//     console.log(err.statusCode)

// !!err.statusCode? err.statusCode : err.statusCode=500;
    if(true)
    { 
        console.log("301")
        return res.json('error');
    }
    console.log('donot run')
    res.json('error2');
    

}