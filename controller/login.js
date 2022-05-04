const {validationResult}=require('express-validator');
const knex = require('../model/connectDB');//db
const bcrypt = require('bcrypt');//hash password
const customError=require('../errors/customError') //error class
const jwt=require('jsonwebtoken');//jwt package

const userLogin = async (req,res,next)=>{
    try{
        ///find user
        const {email,password}=req.body;
        const data = await knex('users').where({
            email:email
        }).first()

        //validation
        if (data===undefined)   throw new customError('Wrong email or password!',400);
        const compareResult=await bcrypt.compare(password,data.password);//carefull, sensitive case first letter
        if (!compareResult) throw new customError('Wrong email or password!',400)
        if (data.status!=="accepted") throw new customError("User is not accepted!",400)

        ////////////JWT
        const token = jwt.sign({email},process.env.JWT_SECRET,{
            expiresIn:'30d'
        });

        ///server response
        res.status(200).json({
            msg:data,
            token
        })

    }catch(error){
        next(error);
    }
}
const userRegister = async(req,res,next)=>{
    try{
        ///validation 
        const validationError=validationResult(req);
        if (!validationError.isEmpty()){
            throw new customError(validationError.array()[0].msg,400);
        }
        const data = await knex('users').where({
            email:req.body.email
        }).first()
        if (data!==undefined)   throw new customError("User have already exist",400);

        ////modify insert data
        req.body.password = await bcrypt.hash(req.body.password,5);
        delete req.body.passwordConfirm;

        //////////////////////////////////
        //Modify something more? checking status,
        //what happen if admin register?
        //////////////////////////////////
        
        ///insert data
        await knex('users').insert({
            ...req.body,
            status:"pending"
        })

        //server response
        res.status(200).json({
            msg:`success added user ${req.body.email}`
        })
    }catch(error){
        console.log(error);
        next(error)
    }
}
module.exports={userLogin,userRegister};