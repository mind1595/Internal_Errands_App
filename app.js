const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const  productRoutes = require('./api/routes/products');
const  userRoutes = require('./api/routes/users');
const  orderRoutes = require('./api/routes/orders');
const  restaurantRoutes = require('./api/routes/restaurants');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://charlesperez:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-khyw1.mongodb.net/test?retryWrites=true',{useNewUrlParser:true});
/*Uncomment For Cleaning Database And Create Admins*/
//require('./api/middleware/seed');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method ==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res(200).json({});
    }

    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);
app.use('/restaurants',restaurantRoutes);

app.use((req,res,next) =>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
module.exports = app;