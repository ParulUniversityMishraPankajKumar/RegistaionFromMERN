import React, { useEffect, useState } from 'react';
import api from '../services/api';

const EmployeeList = ({ onEdit, refreshKey }) => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/', { params: { search } });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey]);

  
  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchEmployees();
  };

 
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/${id}`);
      fetchEmployees();
      alert('Employee deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    }
  };

  return (
    <div className="card p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Employee Records ({employees.length})</h5>

      
        <form className="d-flex" onSubmit={handleSearch}>
          <input
            className="form-control form-control-sm"
            placeholder="Search name, email, or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-sm btn-outline-primary ms-2" type="submit">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Resume</th>
                <th>Country</th>
                <th>State</th>
                <th>City</th>
                <th>Pincode</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="13" className="text-muted">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      {emp.uploadImage ? (
                        <img
                          src={emp.uploadImage}
                          alt="Employee"
                          width="50"
                          height="50"
                          className="rounded-circle object-fit-cover"
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.mobile}</td>
                    <td>
                      {emp.uploadResume ? (
                        <a
                          href={emp.uploadResume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-decoration-none"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-muted">No File</span>
                      )}
                    </td>
                    <td>{emp.country}</td>
                    <td>{emp.state}</td>
                    <td>{emp.city}</td>
                    <td>{emp.pincode}</td>
                    <td>{emp.gender}</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}>
                      {emp.address}
                    </td>
                    <td>
                      {emp.isActive ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => onEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(emp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
