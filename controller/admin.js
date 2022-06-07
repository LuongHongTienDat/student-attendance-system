const knex = require('../model/connectDB');
const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');
const { dirname } = require('path');

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

const addAvailableFile = async(req,res,next)=>{
    try{
        const {name} = req.body;
        const fileName = req.files.availableList.name.split('.').slice(0, -1).join('.')
        var temp = await knex('files').select("*").where('fileName', '=', fileName).first();

        if (temp) {
            res.status(400).json({
                msg:'This file name has existed'
            });      
            return;
        }

        let workbook;
        try{
            workbook = await xlsx.read(req.files.availableList.data,{type:'buffer'});            
        }catch(error){
            next(error);
        }

        //workbook.Sheets.{sheet that have data}
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]); 
        const filePath = path.join(__dirname,'../public/avail_list/', fileName+'.json')

        await fs.writeFile(filePath, JSON.stringify(data))

        var temp = await knex('files').where('fileName', '=', fileName).first();
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

const getAvailableFile = async(req,res,next)=>{
    try{
        const fileName = req.params.fileName;
        data = JSON.parse(await fs.readFile(path.join(__dirname,'../public/avail_list/',fileName+'.json'),'utf8'));
        res.json({
            msg: "success",
            data
        })
    } catch(error) {
        next(error);
    }
}

const deleteAvailableFile = async(req,res,next)=>{
    try{
        const {fileName} = req.body
        fs.unlink(path.join(__dirname,'../public/avail_list/',fileName+'.json')); 
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
    updateStatusEvent, updateStatusUser, updateRoleUser, addAvailableFile, getAvailableFiles, getAvailableFile, deleteAvailableFile}