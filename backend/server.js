const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const generateCustomId = require('../backend/utils/generateCustomId.jS');


require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files (uploaded images and resumes)
app.use('/uploads', express.static('uploads'));

// Routes
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(' MongoDB connected successfully'))
  .catch(err => console.error(' MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    isOk: false,
    message: err.message || 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});