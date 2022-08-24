const knex = require('../model/connectDB');
const customError = require('../errors/customError');
const crypto = require('crypto');
const getUserEvent= async (req,res,next)=>{
    try{
        //get user identifider
        const {email}=req.user;

        //get event data
        const data = await knex('events').where({
            creator_email:email
        }).select('*');

        //server response
        res.status(200).json({
            msg:"success!",
            data:data
        })

    }catch(error){
        console.log(error);
        next(error);
    }
}

const addEvent = async (req,res,next)=>{
    try{
        //get user identifier
        const {email}=req.user;
        var id;
        ////////////////////
        ////checking input data?
        ////////////////////

        ////insert data
        /*data:{
            title,
            location,
            start_date,
            end_date
        }*/
        try{
            id = crypto.randomUUID();
            await knex('events').insert({
                id,//front or back?
                ...req.body,
                creator_email:email, 
                status:'pending'
            });
        }catch(error){
            throw new customError("invalid input data",400);
        }
        

        //server response
        res.status(200).json({
            data:{id} ,
            msg:`success added event ${req.body.name}`
        })
    }catch(error){
        console.log(error);
        next(error);
    }
}

const updateEvent = async(req,res,next)=>{
    try{

    }catch(error){

    }
}

const dropEvent = async(req,res,next)=>{
    try{

    }catch(error){

    }
}

module.exports={getUserEvent,addEvent};