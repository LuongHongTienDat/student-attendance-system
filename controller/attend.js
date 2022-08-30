const knex = require('../model/connectDB');
const customError=require('../errors/customError');
const userCheckIn = async (req,res,next)=>{
    try{
        const {EID,SID}=req.body;
        ////checking event time stamp    ////using trigger in DB?

        const {start_date,end_date}=await knex('events').where({
            id:EID
        }).first();
        const current = new Date();
        if (current<new Date(start_date)||current>new Date(end_date))   throw new customError('the event has ended',400);

        ////checking user status   
        const data = await knex('event_attendances').where({
            SID:SID,
            EID:EID,
        }).first();
        if (data===undefined)   throw new customError('Cannot find user or you',400);
        if (data.check_in===1)  throw new customError('You have already check in',400)  
        ///////update database
        await knex('event_attendances').where({
            SID:SID,
            EID:EID,
        }).update({
            check_in:1
        });

        ///server response
        res.status(200).json({
            msg:'success',
            data:{
                lname: data.lname,
                fname: data.fname,
                SID: data.SID,
                EID: data.EID
            },
        })
    }catch(error){
        next(error);
    }
}
const userCheckOut = async (req,res,next)=>{
    try{
        const {EID,SID}=req.body;
    
        const {start_date,end_date}=await knex('events').where({
            id:EID
        }).first();
        const current = new Date();
        if (current<new Date(start_date)||current>new Date(end_date))   throw new customError('the event has ended',400);
    
        const data = await knex('event_attendances').where({
            SID:SID,
            EID:EID,
        }).first();
        if (data===undefined)   throw new customError('Cannot find user',400);
        if (data.check_in!==1)  throw new customError('You have not checked in yet',400);
        if (data.check_out===1) throw new customError('You have already checked out',400);
        await knex('event_attendances').where({
            SID:SID,
            EID:EID,
        }).update({
            check_out:1
        })
    
        res.status(200).json({
            msg:'success',
            data:{
                lname: data.lname,
                fname: data.fname,
                SID: data.SID,
                EID: data.EID
            },
        })
    }catch(error){
        next(error)
    }
    
}

module.exports={userCheckIn,userCheckOut};