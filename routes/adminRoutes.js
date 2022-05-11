const express = require('express');
const routes = express.Router();
const { getPendingEvents, getCheckedEvents, getPendingUsers, getCheckedUsers,
    updateStatusEvent, updateStatusUser, updateRoleUser, uploadFile, getFiles, getFile, deleteFile } = require('../controller/admin');
const customMid = require('../middleware/index');

routes.route('/event/pending').get(getPendingEvents);
routes.route('/event/checked').get(getCheckedEvents);
routes.route('/event/update-status/:id').patch(updateStatusEvent);

routes.route('/user/pending').get(getPendingUsers);
routes.route('/user/checked').get(getCheckedUsers);
routes.route('/user/update-status/:email').patch(updateStatusUser);
routes.route('/user/update-role/:email').patch(updateRoleUser);

routes.route('/file').post(uploadFile).get(getFile).delete(deleteFile);
routes.route('/file/all').get(getFiles);

module.exports = routes;