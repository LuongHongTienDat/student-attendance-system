const error_handle=require('./error_handler');
const not_found = require('./not_found');
const authentication = require('./auth');
const admin=require('./admin_auth')
module.exports={
    error_handle,
    not_found,
    authentication,
    admin,
}