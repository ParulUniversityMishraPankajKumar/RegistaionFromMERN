const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    uploadImage: {
      type: String, // Store file path or URL
      required: [true, 'Upload image is required'],
      trim: true,
    },

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
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
      trim: true,
    },

    uploadResume: {
      type: String, // File path or URL
      required: [true, 'Upload resume is required'],
      trim: true,
    },

    country: {
      type: String,
      required: [true, 'Country is required'],
    },

    state: {
      type: String,
      required: [true, 'State is required'],
    },

    city: {
      type: String,
      required: [true, 'City is required'],
    },

    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Pincode must be 6 digits'],
    },

    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [10, 'Address must be at least 10 characters'],
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
