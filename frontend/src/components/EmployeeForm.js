// src/components/EmployeeForm.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  address: '',
  gender: '',
  department: '',
  position: '',
  salary: '',
  dateOfJoining: '',
  image: null,
  resume: null,
};

const allowAlphabets = (value) => value.replace(/[^A-Za-z\s]/g, '');
const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

const EmployeeForm = ({ editing, onSaved, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        image: null,
        resume: null,
        dateOfJoining: editing.dateOfJoining ? new Date(editing.dateOfJoining).toISOString().split('T')[0] : '',
      });
      setImagePreview(editing.image ? `http://localhost:5000/uploads/${editing.image}` : null);
    } else {
      setForm(emptyForm);
      setImagePreview(null);
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' || name === 'resume') {
      const file = files[0];
      setForm(prev => ({ ...prev, [name]: file }));
      if (name === 'image') {
        setImagePreview(file ? URL.createObjectURL(file) : null);
      }
      return;
    }

    let newValue = value;
    if (name === 'firstName' || name === 'lastName') {
      newValue = capitalize(allowAlphabets(value));
    }
    if (name === 'phone' || name === 'pincode') {
      newValue = value.replace(/[^0-9]/g, '');
    }

    setForm(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName || form.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (!form.lastName || form.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.gender) newErrors.gender = 'Please select gender';
    
    // Optional fields validation
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (form.salary && isNaN(form.salary)) {
      newErrors.salary = 'Salary must be a number';
    }
    
    // File validation for new employees
    if (!editing && !form.image) {
      newErrors.image = 'Profile image is required';
    }
    if (!editing && !form.resume) {
      newErrors.resume = 'Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(form).forEach(key => {
        if (key !== 'image' && key !== 'resume' && form[key] !== null && form[key] !== undefined && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      // Append files only if they're new
      if (form.image instanceof File) {
        formData.append('image', form.image);
      }
      if (form.resume instanceof File) {
        formData.append('resume', form.resume);
      }

      if (editing && editing._id) {
        await api.put(`/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Employee updated successfully!');
      } else {
        await api.post('/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Employee registered successfully!');
      }

      setForm(emptyForm);
      setImagePreview(null);
      onSaved && onSaved();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      alert(`Error: ${msg}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm(emptyForm);
    setErrors({});
    setImagePreview(null);
  };

  const handleCancel = () => {
    handleClear();
    onCancel && onCancel();
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h5 className="mb-4 text-primary fw-bold">
        {editing ? ' Edit Employee' : ' Register Employee'}
      </h5>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading}>
          {/* File Uploads */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Profile Image *</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
              />
              {errors.image && <div className="invalid-feedback">{errors.image}</div>}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #dee2e6' }}
                />
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Resume (PDF/DOC) *</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className={`form-control ${errors.resume ? 'is-invalid' : ''}`}
              />
              {errors.resume && <div className="invalid-feedback">{errors.resume}</div>}
              {editing && editing.resume && (
                <small className="text-muted d-block mt-1">
                  Current: <a href={`http://localhost:5000/uploads/${editing.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a>
                </small>
              )}
            </div>
          </div>

          {/* Names */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">First Name *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder="Enter first name"
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Last Name *</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                placeholder="Enter last name"
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="example@email.com"
                disabled={editing} // Prevent email change during edit
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                maxLength={10}
                placeholder="10 digit number"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>

          {/* Country / State / City */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Country *</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className={`form-select ${errors.country ? 'is-invalid' : ''}`}
              >
                <option value="">--Select Country--</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
              {errors.country && <div className="invalid-feedback">{errors.country}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">State *</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className={`form-select ${errors.state ? 'is-invalid' : ''}`}
                disabled={!form.country}
              >
                <option value="">--Select State--</option>
                {form.country === 'India' && (
                  <>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                  </>
                )}
                {form.country === 'USA' && (
                  <>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                  </>
                )}
              </select>
              {errors.state && <div className="invalid-feedback">{errors.state}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">City *</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                disabled={!form.state}
              >
                <option value="">--Select City--</option>
                {form.state === 'Gujarat' && (
                  <>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                  </>
                )}
                {form.state === 'Maharashtra' && (
                  <>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </>
                )}
              </select>
              {errors.city && <div className="invalid-feedback">{errors.city}</div>}
            </div>
          </div>

          {/* Pincode & Address */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Pincode</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                maxLength={6}
                className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                placeholder="6 digits"
              />
              {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
            </div>
            <div className="col-md-8">
              <label className="form-label fw-semibold">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="form-control"
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Department, Position, Salary */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">--Select--</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Position</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Salary</label>
              <input
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
                className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                placeholder="Annual salary"
              />
              {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
            </div>
          </div>

          {/* Date of Joining & Gender */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={form.dateOfJoining}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold d-block">Gender *</label>
              <div className="mt-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <div className="form-check form-check-inline" key={g}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      className="form-check-input"
                      id={`gender-${g}`}
                    />
                    <label className="form-check-label" htmlFor={`gender-${g}`}>{g}</label>
                  </div>
                ))}
              </div>
              {errors.gender && <div className="text-danger small mt-1">{errors.gender}</div>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading ? ' Processing...' : editing ? ' Update Employee' : ' Save Employee'}
            </button>
            <button type="button" className="btn btn-warning px-4" onClick={handleClear} disabled={loading}>
               Clear
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary px-4" onClick={handleCancel} disabled={loading}>
                 Cancel
              </button>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EmployeeForm;