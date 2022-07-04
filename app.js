const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
require('dotenv').config();
const customMid = require('./middleware/index.js')
const routes = require('./routes/routes.js');
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

//parse-middleware
app.use(fileUpload());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//routes
app.use('/api/v1',routes);

//error_handle
app.use(customMid.error_handle);
app.use(customMid.not_found);

//start server
const PORT = process.env.PORT || 3000;
const start = async ()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`Server run at port ${PORT}`);
        })
    }catch(error){
        console.log(error);
    }
}
start();
