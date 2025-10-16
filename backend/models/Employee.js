const Employee = require('../models/Employee');
const Counter = require('../models/counter'); 

exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
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

// Get single employee by MongoDB _id
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        isOk: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      isOk: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      isOk: false,
      message: error.message,
    });
  }
};

// Update employee details
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        isOk: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      isOk: true,
      message: 'Employee updated successfully',
      data: updated,
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

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const removed = await Employee.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        isOk: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      isOk: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      isOk: false,
      message: error.message,
    });
  }
};
