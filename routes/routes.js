const express = require('express');
const routes = express.Router();
const { userLogin, userRegister }=require('../controller/login')
const { getUser, modifyUser }=require('../controller/user');
const { getUserEvent, addEvent }=require('../controller/events');
const { userCheckIn, userCheckOut }=require('../controller/attend');
const { postEventAttendances, getEventAttendances, getAvailableAttendanceList } = require('../controller/attendance');
const register_validation = require('../validation/register_validation');

const customMid = require('../middleware/index');
const adminRoutes = require('./adminRoutes');

routes.route('/login').post(userLogin);
routes.route('/register').post(register_validation(),userRegister);
routes.route('/user').all(customMid.authentication).get(getUser).patch(modifyUser)
routes.route('/user/event').all(customMid.authentication).get(getUserEvent).post(addEvent);

routes.route('/user/attendance').post(postEventAttendances).get(getEventAttendances);
routes.route('/user/attendance/list').get(getAvailableAttendanceList);
routes.route('/user/attendance/check_in').post(userCheckIn);
routes.route('/user/attendance/check_out').post(userCheckOut);

routes.use('/admin',customMid.authentication,customMid.admin,adminRoutes)

module.exports=routes;