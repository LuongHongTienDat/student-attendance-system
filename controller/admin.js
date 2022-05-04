const knex = require('../model/connectDB');

const getAllPendingEvent = async(req,res,next)=>{
    try{
        
    }catch(error){
        next(error);
    }
}

const getCheckedEvent = async(req,res,next)=>{
    try{
        //get user identifier
        const {email}=req.body;

        //get data
        const data = await knex('events').where({
            status:"accepted"
        }).orWhere({
            status:"rejected"
        }).select('*');

        //server response
        res.status(200).json({
            msg:"success",
            data:data
        })

    }catch(error){
        next(error);
    }
}

const getPendingUser = async(req,res,next)=>{
    
}

