import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Empty form object
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
};

// Utility functions
const allowAlphabets = (value) => value.replace(/[^A-Za-z\s]/g, '');
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const EmployeeForm = ({ editing, onSaved, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Set form data for edit mode
  useEffect(() => {
    if (editing) setForm(editing);
    else setForm(emptyForm);
  }, [editing]);

  // Handle field changes
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Sanitize name fields
    if (name === 'firstName' || name === 'lastName') {
      value = capitalize(allowAlphabets(value));
    }

    // Prevent non-numeric input for mobile and pincode
    if (name === 'mobile' || name === 'pincode') {
      value = value.replace(/[^0-9]/g, '');
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error when typing
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName || form.firstName.trim().length < 2)
      newErrors.firstName = 'First name must be at least 2 characters';

    if (!form.lastName || form.lastName.trim().length < 2)
      newErrors.lastName = 'Last name must be at least 2 characters';

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Please enter a valid email address';

    if (!form.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile))
      newErrors.mobile = 'Mobile number must be 10 digits';

    if (!form.country) newErrors.country = 'Country is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.city) newErrors.city = 'City is required';

    if (!form.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = 'Pincode must be 6 digits';

    if (!form.address) newErrors.address = 'Address is required';
    else if (form.address.trim().length < 10)
      newErrors.address = 'Address must be at least 10 characters long';

    if (!form.gender) newErrors.gender = 'Please select a gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editing && editing._id) {
        await api.put(`/${editing._id}`, form);
        alert('Employee updated successfully!');
      } else {
        await api.post('/', form);
        alert('Employee registered successfully!');
      }
      setForm(emptyForm);
      onSaved && onSaved();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    setForm(emptyForm);
    setErrors({});
    onCancel && onCancel();
  };

  return (
    <div className="card p-4 shadow-sm mb-3">
      <h5 className="mb-3">{editing ? 'Edit Employee' : 'Register Employee'}</h5>

      <form onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              required
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              required
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label>Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            maxLength={10}
            onChange={handleChange}
            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
            required
          />
          {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
        </div>

        {/* Location Info */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label>Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className={`form-select ${errors.country ? 'is-invalid' : ''}`}
              required
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
              required
            >
              <option value="">-- Select State --</option>

              {/* States by Country */}
              {form.country === 'India' && (
                <>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </>
              )}

              {form.country === 'USA' && (
                <>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="New York">New York</option>
                  <option value="Florida">Florida</option>
                </>
              )}

              {form.country === 'UK' && (
                <>
                  <option value="England">England</option>
                  <option value="Scotland">Scotland</option>
                  <option value="Wales">Wales</option>
                </>
              )}

              {form.country === 'Canada' && (
                <>
                  <option value="Ontario">Ontario</option>
                  <option value="Quebec">Quebec</option>
                  <option value="British Columbia">British Columbia</option>
                </>
              )}

              {form.country === 'Australia' && (
                <>
                  <option value="New South Wales">New South Wales</option>
                  <option value="Victoria">Victoria</option>
                  <option value="Queensland">Queensland</option>
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
              required
            >
              <option value="">-- Select City --</option>

              {form.state === 'Gujarat' && (
                <>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Surat">Surat</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Gandhi Nagar">Gandhi Nagar</option>
                </>
              )}

              {form.state === 'Uttar Pradesh' && (
                <>
                  <option value="Ayodhya">Ayodhya</option>
                  <option value="Gonda">Gonda</option>
                  <option value="Kanpur">Kanpur</option>
                </>
              )}

              {form.state === 'California' && (
                <>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="San Diego">San Diego</option>
                </>
              )}
            </select>
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
          </div>
        </div>

        {/* Pincode */}
        <div className="mb-3">
          <label>Pincode</label>
          <input
            name="pincode"
            value={form.pincode}
            maxLength={6}
            onChange={handleChange}
            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
            required
          />
          {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="2"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            required
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        {/* Gender */}
        <div className="mb-3">
          <label>Gender</label>
          <div>
            {['Male', 'Female', 'Other'].map((g) => (
              <div className="form-check form-check-inline" key={g}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                />
                <label className="form-check-label">{g}</label>
              </div>
            ))}
          </div>
          {errors.gender && <div className="text-danger small">{errors.gender}</div>}
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : editing ? 'Update Employee' : 'Save Employee'}
          </button>
          {editing && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
