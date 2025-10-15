const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\gmail.com\S+$/, 'Invalid email format'],
      trim: true,
    },
    mobile: {
      type: Number,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
