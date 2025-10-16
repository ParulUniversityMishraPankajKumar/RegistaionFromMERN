const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  customId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: String,
  city: String,
  state: String,
  country: String,
  department: String,
  position: String,
  salary: Number,
  image: String,
  resume: String,
  dateOfJoining: Date,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);