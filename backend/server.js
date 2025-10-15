require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');

const app =express();
app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employeeDB';

connectDB(MONGO_URI);
app.use('/api/employees',employeeRoutes);
app.get('/',(req,res) => res.send('Employee Management Api is running'));

const PORT =process.env.PORT || 5000;
app.listen(PORT,()=> console.log('server running on port ${PORT}'));