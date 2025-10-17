
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/employeeController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      // Accept images only
      if (!file.originalname.match(/\.(jpg|jpeg)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    } else if (file.fieldname === 'resume') {
      // Accept PDF and DOC files
      if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
        return cb(new Error('Only PDF and DOC files are allowed!'), false);
      }
    }
    cb(null, true);
  }
});

// CRUD routes
router.post('/create', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), controller.createEmployee);

router.get('/get', controller.getEmployees);
router.get('/get/:id', controller.getEmployeeById);

router.put('/update/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), controller.updateEmployee);

router.delete('/delete/:id', controller.deleteEmployee);

module.exports = router;