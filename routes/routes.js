const express = require('express');
const routes = express.Router();
const { userLogin, userRegister } = require('../controller/login')
const { getUser, modifyUser } = require('../controller/user');
const { getUserEvent, addEvent } = require('../controller/events');
const register_validation = require('../validation/register_validation');
const customMid = require('../middleware/index');
const adminRoutes = require('./adminRoutes');

routes.route('/login').post(userLogin);
routes.route('/register').post(register_validation(),userRegister);
routes.route('/user').all(customMid.authentication).get(getUser).patch(modifyUser)
routes.route('/user/event').all(customMid.authentication,customMid.admin).get(getUserEvent).post(addEvent);
routes.use('/admin',adminRoutes)
module.exports=routes;