const knex = require('../model/connectDB');
const path = require('path');
const xlsx = require('xlsx');
const customError=require('../errors/customError');
const fs = require('fs/promises');

const postEventAttendances = async(req,res,next)=>{ /// posting attendance list for a specific event
    try{
        const {EID} = req.body; // get event ID
        
        ///processing file data
        let workbook;
        try{
            //req.files.{key of the file in data form}.data
            workbook = xlsx.read(req.files.studentlist.data,{type:'buffer'});            
        }catch(error){
            
            throw new customError("you must upload a file!",400);
        }
        //workbook.Sheets.{sheet that have data}
        const data = xlsx.utils.sheet_to_json(workbook.Sheets.student_sheet); 

        //insert into db
        try{
            for (let i=0;i<data.length;i++){
                await knex('event_attendances').insert({...data[i],EID:EID});
            }
        }catch(error){
            console.log(error.message);
            throw new customError("invalid file structure or data have already been added",400);
        }

        ///server response
        res.status(200).json({
            success:true,
            EID:EID,
            data:data
        })
    }catch(err){
        next(err)
    }
}
// const postAvailableAttendances = async(req,res,next)=>{
//     try{
//         const {EID}=req.body //get event ID
//         const fileName = req.params.fileName; //get file name
//         let data;
//         try{
//             data = JSON.parse(await fs.readFile(path.join(__dirname,'../public/avail_list/',fileName+'.json'),'utf8'));
//             for (let i=0;i<data.length;i++){
//                 await knex('event_attendances').insert({...data[i],EID:EID});
//             }
//         }catch(error){
//             console.log(error.message);
//             throw new customError("invalid file structure or data have already been added",400);
//         }
        

//         res.status(200).json({
//             EID,
//             data:data
//         })

//     }    catch(err){
//         console.log(err)
//         next(err);
//     }
// }
const getEventAttendances= async (req,res,next)=>{ //gett the attendance list of a specific event
    try{
        const {EID}=req.query;
        const data = await knex('event_attendances').where({
            EID:EID
        }).select('SID','fname','lname','check_in','check_out');
        res.status(200).json({
            success:true,
            data:data,
        })
    }catch(err){
        next(err);
    }

}
const getAvailableAttendanceList = async (req,res,next)=>{ //get all available attendance lists from admin
    try{
        const data = await knex('files').select('*');
        res.status(200).json({
            success:true,
            data:data
        })
    }catch(error){
        next(error)
    }
    
}


module.exports={postEventAttendances,getAvailableAttendanceList,getEventAttendances};