const express=require('express');
const routes=express.Router();
const { userLogin, userRegister }=require('../controller/login')
const { getUser, modifyUser }=require('../controller/user');
const { getUserEvent, addEvent }=require('../controller/events');
const { postUserAttendances, postAvailableAttendances } = require('../controller/attendance');
const register_validation = require('../validation/register_validation');
const customMid = require('../middleware/index');


routes.route('/login').post(userLogin);
routes.route('/register').post(register_validation(),userRegister);
routes.route('/user').all(customMid.authentication).get(getUser).patch(modifyUser)
routes.route('/user/event').all(customMid.authentication).get(getUserEvent).post(addEvent);
routes.route('/user/attendance').post(postUserAttendances);
routes.route('/user/attendance/:fileName').post(postAvailableAttendances)
module.exports=routes;