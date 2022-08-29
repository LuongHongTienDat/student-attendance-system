const knex = require('../model/connectDB');
const customError=require('../errors/customError');
const bcrypt=require('bcrypt');
const getUser= async(req,res,next)=>{
    try{
        //get data
        const {email}=req.user;
        const data = await knex('users').where({
            email:email
        }).first().select('email','fullName','birthday','id','phone');

        //server response
        res.status(200).json({
            msg:'success',
            data:data
        })

    }catch(error){
        next(error);
    }
}
const modifyUser= async (req,res,next)=>{
    try{
        const {email}=req.user;
        //checking modify detail
        if (req.body.email||req.body.sid) throw new customError("Cannot change email or sid",400)
        if (req.body.role||req.body.status) throw new customError("You are not authorized to change role or status",404);

        ///user want to change password here?

        //patching data
        try{
            await knex('users').where({
                email:email
            }).update(req.body);
        }catch(error){
            throw new customError("Invalid input data!",400);
        }

        //server response
        res.status(200).json({
            msg:`success updated user ${email}`
        })

    }catch(error){
        next(error);
    }
}
const modifyPassword= async (req,res,next)=>{
    
}

module.exports={getUser,modifyUser};