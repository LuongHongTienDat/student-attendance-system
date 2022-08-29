const knex = require('../model/connectDB');
const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');
const { dirname } = require('path');
const formidable = require('formidable')
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
        .select('email', 'fullName', 'status', 'role','phone','birthday','id');

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
        }).select('email', 'fullName', 'status', 'role','phone','birthday','id');

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

const addAvailableFile = async(req,res,next)=>{
    try{
        const {name} = req.body;

        const regex = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xlsx|.csv)$/i
        // const fileName = req.files.availableList.name.split('.').slice(0, -1).join('.')
        const fileName = req.files.availableList.name
        if (!regex.test(fileName)){
            res.status(400).json({
                msg:'File name or extension can be not valid'
            });      
            return;           
        }
        var temp = await knex('files').select("*").where('fileName', '=', fileName).first();
        if (temp) {
            res.status(400).json({
                msg:'This file name has existed'
            });      
            return;
        }

        const filePath = path.join(__dirname,'../public/avail_list/', fileName)

        const file = req.files.availableList;
      
        file.mv(filePath, async (err) => {
            if (err) {
                next(err);
            }
            await knex('files')
            .insert({
                name,
                fileName
            })
            res.json({
                msg: "success",
                data: {
                    name,
                    fileName
                }
            });
        });

        
    } catch(error) {
        next(error);
    }
}

const getAvailableFiles = async(req,res,next)=>{
    try{
        const data = await knex('files').select('*');
        res.status(200).json({
            msg: "success",
            data: data
        })      
    } catch(error) {
        next(error);
    }
}

const updateAvailableFile = async(req,res,next)=>{
    try{
        const {fileName} = req.body;
        const fileNameUpload = req.files.availableList.name

        const regex = /([a-zA-Z0-9\s_\\.\-\(\):])+(.xlsx|.csv)$/i
        // const fileName = req.files.availableList.name.split('.').slice(0, -1).join('.')
        if (!regex.test(fileNameUpload)){
            res.status(400).json({
                msg:'File name or extension can be not valid'
            });      
            return;           
        }

        var temp = await knex('files').select("*").where('fileName', '=', fileName).first();
        if (!temp) {
            res.status(400).json({
                msg:'This file name has not existed'
            });      
            return;
        }

        const filePath = path.join(__dirname,'../public/avail_list/', fileName)

        const file = req.files.availableList;
      
        file.mv(filePath, async (err) => {
            if (err) {
                next(err);
            }
            res.json({
                msg: "success",
                data: {
                    name: temp.name,
                    fileName
                }
            });
        });

        
    } catch(error) {
        next(error);
    }
}

// const getAvailableFile = async(req,res,next)=>{
//     try{
//         const fileName = req.params.fileName;
//         data = JSON.parse(await fs.readFile(path.join(__dirname,'../public/avail_list/',fileName),'utf8'));
//         res.json({
//             msg: "success",
//             data
//         })
//     } catch(error) {
//         next(error);
//     }
// }

const deleteAvailableFile = async(req,res,next)=>{
    try{
        const {fileName} = req.body
        fs.unlink(path.join(__dirname,'../public/avail_list/',fileName)); 
        await knex('files')
            .where('fileName', '=', fileName)
            .del()           
        res.json({
            msg: "success"
        })
    } catch(error) {
        next(error);
    }
}
module.exports = { getPendingEvents, getCheckedEvents, getPendingUsers, getCheckedUsers,
    updateStatusEvent, updateStatusUser, updateRoleUser, addAvailableFile, getAvailableFiles, updateAvailableFile,deleteAvailableFile}
