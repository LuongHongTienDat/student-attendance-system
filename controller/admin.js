const knex = require('../model/connectDB');

const getPendingEvents = async (req,res,next)=>{
    try{
        const data = await knex('events').where({
            status:"pending"
        })
        .select('*');
        res.status(200).json({
            msg: "success",
            data: data
        })        
    } catch(error){
        next(error);
    }
}

const getCheckedEvents = async(req,res,next)=>{
    try{
        //get data
        const data = await knex('events').where({
            status:"accepted"
        }).orWhere({
            status:"rejected"
        }).select('*');

        //server response
        res.status(200).json({
            msg:"success",
            data: data
        })

    } catch(error){
        next(error);
    }
}

const getPendingUsers = async(req,res,next) =>{
    try{
        const data = await knex('users').where({
            status:"pending"
        })
        .select('email', 'name', 'status', 'role');
        res.status(200).json({
            msg: "success",
            data: data
        })        
    } catch(error){
        next(error);
    }   
}

const getCheckedUsers = async(req,res,next)=>{
    try{
        //get data
        const data = await knex('users').where({
            status:"accepted"
        }).orWhere({
            status:"rejected"
        }).select('email', 'name', 'status', 'role');

        //server response
        res.status(200).json({
            msg:"success",
            data: data
        })

    } catch(error){
        next(error);
    }
}

const updateStatusEvent = async(req,res,next)=>{
    try{
        // Get status requested to update
        var {status} = req.body;
        // Get event from db
        var event = await knex.select('status').where({id: req.params.id}).from('events');
        if (!event) {
            res.status(404).json({
                msg:'Event does not exist'
            });
        }
        else if (event[0].status != 'pending'){
            res.status(400).json({
                msg:'This event has already been '+ event[0].status
            });
        }
        else if (status != 'accepted' && status != 'rejected'){
            res.status(400).json({
                msg:'Cannot update status to this value: '+ status
            });
        }
        else {
            await knex('events')
            .where('id', '=', req.params.id)
            .update({
                status,
            });
            res.json({
                msg: 'Success'
            });
        };
    } catch(error) {
        next(error);
    }
}



const updateStatusUser = async(req,res,next)=>{
    try{
        // Get status requested to update
        var {status} = req.body;

        // Get user from db
        var user = await knex.select('status').where({email: req.params.email}).from('users');
        if (!user) {
            res.status(404).json({
                msg:'User does not exist'
            });
        }
        else if (user[0].status != 'pending'){
            res.status(400).json({
                msg:'This user has already been '+ user[0].status
            });
        }
        else if (status != 'accepted' && status != 'rejected'){
            res.status(400).json({
                msg:'Cannot update status to this value: '+ status
            });
        }
        else {
            await knex('users')
            .where('email', '=', req.params.email)
            .update({
                status,
            });
            res.json({
                msg: 'Success'
            });
        };
    } catch(error) {
        next(error);
    }
}

const updateRoleUser = async(req,res,next)=>{
    try{
        // Get requested role to update
        var {role} = req.body;

        // Get user from db
        var user = await knex.select('status').where({email: req.params.email}).from('users');
        if (!user) {
            res.status(404).json({
                msg:'User does not exist'
            });
        }
        else if (user[0].status != 'accepted'){
            res.status(400).json({
                msg:'This user has not been accepted'
            });
        }
        else if (role != 1 && role != 0){
            res.status(400).json({
                msg: 'Cannot update role to this value '
            });
        }
        else {
            await knex('users')
            .where('email', '=', req.params.email)
            .update({
              role,
            });
            res.json({
              msg: 'Success'
            });
        };
    } catch(error) {
        next(error);
    }
}
const addAvailableList = async (req,res,next)=>{
    try{

    }catch(err){
        next(err);
    }
}
module.exports = { getPendingEvents, getCheckedEvents, getPendingUsers, getCheckedUsers,
    updateStatusEvent, updateStatusUser, updateRoleUser };