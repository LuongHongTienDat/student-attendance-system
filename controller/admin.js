const knex = require('../model/connectDB');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
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

const uploadFile = async(req,res,next)=>{
    try{
        // Set up
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (!files.file.originalFilename.match(/\.(xlsx|csv)$/i)){
                res.status(400).json({ msg: files.file.originalFilename + " is not allowed"});
            }
            var oldPath = files.file.filepath;
            var newPath = path.join(path.dirname(__dirname), "public", "files", files.file.originalFilename);
            var rawData = fs.readFileSync(oldPath);
            //res.json({ oldPath, newPath});
            fs.writeFile(newPath, rawData, async function(err){
                var newFile = {
                    name: fields.name,
                    fileName: files.file.originalFilename
                }
                if (err) { res.json({mag: "error"})}
                var temp = await knex('files').where('fileName', '=', newFile.fileName).first();
                if (temp){
                    await knex('files')
                    .where('fileName', '=', newFile.fileName)
                    .update({
                      name: fields.name
                    })
                    .then( () => {
                        res.json({
                            msg: "success",
                            data: newFile
                        });
                    })                   
                }
                else {
                    await knex('files')
                    .insert(newFile)
                    .then( () => {
                        res.json({
                            msg: "success",
                            data: newFile
                        });
                    })
                }
            })
        });       
    } catch(error) {
        next(error);
    }
}

const getFiles = async(req,res,next)=>{
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

const getFile = async(req,res,next)=>{
    try{
        var options = {
            root:  path.join(path.dirname(__dirname), "public", "files")
        };
         
        var fileName = req.body.fileName;
        console.log(fileName);
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
            }
        });     
    } catch(error) {
        next(error);
    }
}

const deleteFile = async(req,res,next)=>{
    try{
        fs.unlink(path.join(path.dirname(__dirname), "public", "files", req.body.fileName), async function(err){
            await knex('files')
                .where('fileName', '=', req.body.fileName)
                .del()           
            res.json({
                msg: "success"
            })
       }); 

    } catch(error) {
        next(error);
    }
}
module.exports = { getPendingEvents, getCheckedEvents, getPendingUsers, getCheckedUsers,
    updateStatusEvent, updateStatusUser, updateRoleUser, uploadFile, getFiles, getFile, deleteFile}