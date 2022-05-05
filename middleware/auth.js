const jwt= require('jsonwebtoken');
const customError = require('../errors/customError');
const authentication = async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        if (token===undefined)    throw new customError("No token provided",401);

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const {email}=decoded;
            req.user={email};
            next();
        }catch(error){
            throw new customError("Not authorized!",401);
        }
    }catch(error){
        next(error);
    }
}
module.exports=authentication