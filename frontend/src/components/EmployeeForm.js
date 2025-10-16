import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Empty default form
const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
  address: '',
  gender: '',
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
    if (editing) setForm(editing);
    else setForm(emptyForm);
  }, [editing]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // File uploads
    if (name === 'image' || name === 'resume') {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));

      if (name === 'image') {
        setImagePreview(file ? URL.createObjectURL(file) : null);
      }
      return;
    }

    let newValue = value;
    if (name === 'firstName' || name === 'lastName') {
      newValue = capitalize(allowAlphabets(value));
    }
    if (name === 'mobile' || name === 'pincode') {
      newValue = value.replace(/[^0-9]/g, '');
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate inputs
  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName || form.firstName.trim().length < 2)
      newErrors.firstName = 'First name must be at least 2 characters';
    if (!form.lastName || form.lastName.trim().length < 2)
      newErrors.lastName = 'Last name must be at least 2 characters';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Please enter a valid email';
    if (!form.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile))
      newErrors.mobile = 'Mobile must be 10 digits';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = 'Pincode must be 6 digits';
    if (!form.address) newErrors.address = 'Address is required';
    else if (form.address.trim().length < 10)
      newErrors.address = 'Address must be at least 10 characters';
    if (!form.gender) newErrors.gender = 'Please select gender';
    if (!form.image) newErrors.image = 'Profile image is required';
    if (!form.resume) newErrors.resume = 'Resume upload is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      if (editing && editing._id) {
        await api.put(`/${editing._id}`, formData);
        alert('Employee updated successfully!');
      } else {
        await api.post('/', formData);
        alert('Employee registered successfully!');
      }

      setForm(emptyForm);
      setImagePreview(null);
      onSaved && onSaved();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      alert(`Error: ${msg}`);
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
    <div className="card p-4 shadow-sm mb-3">
      <h5 className="mb-3 text-primary fw-bold">
        {editing ? 'Edit Employee Details' : 'Register New Employee'}
      </h5>

      <form onSubmit={handleSubmit}>
    
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Profile Image</label>
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
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label>Upload Resume</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className={`form-control ${errors.resume ? 'is-invalid' : ''}`}
            />
            {errors.resume && <div className="invalid-feedback">{errors.resume}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your Email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label>Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
            maxLength={10}
            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
          />
          {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
        </div>

 
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className={`form-select ${errors.country ? 'is-invalid' : ''}`}
            >
              <option value="">-- Select Country --</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label>State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className={`form-select ${errors.state ? 'is-invalid' : ''}`}
              disabled={!form.country}
            >
              <option value="">-- Select State --</option>
              {form.country === 'India' && (
                <>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Rajasthan">Rajasthan</option>
                </>
              )}
            </select>
            {errors.state && <div className="invalid-feedback">{errors.state}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label>City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`form-select ${errors.city ? 'is-invalid' : ''}`}
              disabled={!form.state}
            >
              <option value="">-- Select City --</option>
              {form.state === 'Gujarat' && (
                <>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Surat">Surat</option>
                  <option value="Rajkot">Rajkot</option>
                </>
              )}
            </select>
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label>Pincode</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Enter your Pincode"
            maxLength={6}
            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
          />
          {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter full address"
            rows="2"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="mb-3">
          <label>Gender</label>
          <div>
            {['Male', 'Female', 'Other'].map((g) => (
              <div className="form-check form-check-inline" key={g}>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label className="form-check-label">{g}</label>
              </div>
            ))}
          </div>
          {errors.gender && <div className="text-danger small">{errors.gender}</div>}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : editing ? 'Update Employee' : 'Save Employee'}
          </button>

          <button
            type="button"
            className="btn btn-warning"
            onClick={handleClear}
            disabled={loading}
          >
            Clear Form
          </button>

          {editing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
