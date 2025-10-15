const Employee = require('../models/Employee');
//create employee

exports.createEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        // handle duplicate email
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Get all 
exports.getEmployees = async (req, res) => {
    try {
        const search = req.query.search || '';
        const query = search ? {
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
            ]
        } : {};
        const employees = await Employee.find(query).sort({ createdAt: -1 });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update
exports.updateEmployee = async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
        res.json(updated);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
        res.status(400).json({ message: error.message });
    }
};

// delete
exports.deleteEmployee = async (req, res) => {
    try {
        const removed = await Employee.findOneAndDelete(req.params.id);
        if (!removed)
            return
        res.status(404).json({ message: 'Employee not found' });

    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }

}