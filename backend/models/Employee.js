const Employee = require('../models/Employee'); // Make sure model exports mongoose.model
const Counter = require('../models/counter'); 
const fs = require('fs');
const path = require('path');

// Helper to generate custom employee ID
const generateCustomId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { id: 'employeeId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `EMP${counter.seq.toString().padStart(3, '0')}`;
};

// CREATE Employee
exports.createEmployee = async (req, res) => {
  try {
    const customId = await generateCustomId();

    // Handle file uploads if using multer
    const imageFile = req.files?.image?.[0]?.filename || '';
    const resumeFile = req.files?.resume?.[0]?.filename || '';

    const employee = new Employee({
      ...req.body,
      customId,
      image: imageFile,
      resume: resumeFile,
    });

    await employee.save();

    res.status(201).json({
      isOk: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        isOk: false,
        message: 'Email already exists',
      });
    }
    res.status(400).json({
      isOk: false,
      message: error.message,
    });
  }
};

// GET all Employees
exports.getEmployees = async (req, res) => {
  try {
    const search = req.query.search || '';
    const sorton = req.query.sorton || 'createdAt';
    const sortdir = req.query.sortdir === 'asc' ? 1 : -1;

    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { state: { $regex: search, $options: 'i' } },
            { customId: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const employees = await Employee.find(query).sort({ [sorton]: sortdir });

    res.status(200).json({
      isOk: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      isOk: false,
      message: error.message,
    });
  }
};

// GET Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ isOk: false, message: 'Employee not found' });

    res.status(200).json({ isOk: true, data: employee });
  } catch (error) {
    res.status(500).json({ isOk: false, message: error.message });
  }
};

// UPDATE Employee
exports.updateEmployee = async (req, res) => {
  try {
    // Handle file uploads if any
    if (req.files) {
      if (req.files.image) req.body.image = req.files.image[0].filename;
      if (req.files.resume) req.body.resume = req.files.resume[0].filename;
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ isOk: false, message: 'Employee not found' });

    res.status(200).json({
      isOk: true,
      message: 'Employee updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ isOk: false, message: 'Email already exists' });
    res.status(400).json({ isOk: false, message: error.message });
  }
};

// DELETE Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const removed = await Employee.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ isOk: false, message: 'Employee not found' });

    // Optionally remove uploaded files
    if (removed.image) fs.unlinkSync(path.join(__dirname, '../uploads/', removed.image));
    if (removed.resume) fs.unlinkSync(path.join(__dirname, '../uploads/', removed.resume));

    res.status(200).json({
      isOk: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ isOk: false, message: error.message });
  }
};
