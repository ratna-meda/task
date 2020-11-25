 const express = require('express');
 const app = express();
 const morgan = require('morgan');
 const bodyParser = require('body-parser');
 const dotenv   = require('dotenv');
const  connectDB = require('./config/db');
const  colors = require('colors');

 const productsRoutes = require('./api/routes/products');
 const orderRoutes = require('./api/routes/orders');

// load dotenv
dotenv.config({path:'./config/config.env'});

// Connect DataBase
connectDB();

// Morgan Logger
 app.use(morgan('dev'));

 // Body Parser Middleware
 app.use(bodyParser.urlencoded({extended:false}));
 app.use(bodyParser.json());

 // cors Error with respective Browser
 app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT , POST, PATCH, DELETE, GET');
        return res.status(200),json({});
    }
    next();
 });

 // routes 
 app.use('/products',productsRoutes);
 app.use('/orders',orderRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req,res,next) => {
    res.status(error.status || 500);
     res.json({
         error:{
             message:error.message
         }
     });
});

 module.exports = app;