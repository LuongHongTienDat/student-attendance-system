const customError=require('../errors/customError');
const knex = require('../model/connectDB');
const admin_authentication=async(req,res,next)=>{
    try{
        const {email}=req.user;
        const data = await knex('users').where({
            email:email
        }).first();
        
        if (!data||data.role!==1)   throw new customError("You are not the admin!",404);

        next();
    }catch(error){
        next(error);
    }
}
module.exports=admin_authentication;