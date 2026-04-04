const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const connectDB = require('./config/db');
connectDB();
const cors = require('cors');

const port = process.env.PORT || 5000;
const userRouter = require('../backend/routes/userRouter');
const adminRouter = require('../backend/routes/adminRouter');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads",express.static(path.join(__dirname,"/uploads")));
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:4000', 'http://localhost:4001'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());
app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);
app.get('/',(req,res) => {
    res.send('Hello user');
})
app.get('/admin',(req,res) => {
    res.send("Hello admin");
})
app.listen(port,() => {
    console.log(`Server started running...`);
})

