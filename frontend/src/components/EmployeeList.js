import React, { useEffect, useState } from 'react';
import api from '../services/api';

const EmployeeList = ({ onEdit, refreshKey }) => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/', {
        params: {
          search,
          sorton: sortConfig.field,
          sortdir: sortConfig.direction
        }
      });
      
      // Handle the nested data structure from backend
      const data = Array.isArray(res) ? res : res.data || [];
      setEmployees(data);
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey, sortConfig]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await api.delete(`/${id}`);
      alert('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err?.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ field }) => {
    if (sortConfig.field !== field) return <span className="text-muted">⇅</span>;
    return sortConfig.direction === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="card p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">
          👥 Employee Records 
          <span className="badge bg-primary ms-2">{employees.length}</span>
        </h5>
        
        <form className="d-flex" onSubmit={handleSearch}>
          <input
            className="form-control form-control-sm"
            placeholder="Search by name, email, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: '250px' }}
          />
          <button className="btn btn-sm btn-outline-primary ms-2" type="submit">
             Search
          </button>
          {search && (
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              type="button"
              onClick={() => { setSearch(''); }}
            >
              
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading employees...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('customId')}>
                  ID <SortIcon field="customId" />
                </th>
                <th>Image</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('firstName')}>
                  Name <SortIcon field="firstName" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                  Email <SortIcon field="email" />
                </th>
                <th>Phone</th>
                <th>Department</th>
                <th>Position</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('city')}>
                  Location <SortIcon field="city" />
                </th>
                <th>Gender</th>
                <th>Resume</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  Status <SortIcon field="status" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-muted py-4">
                    <div className="text-center">
                      <p className="mb-0"> No employees found</p>
                      {search && <small>Try a different search term</small>}
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp._id}>
                    <td className="fw-semibold text-primary">{emp.customId || 'N/A'}</td>
                    <td>
                      {emp.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${emp.image}`}
                          alt={`${emp.firstName}`}
                          width="50"
                          height="50"
                          className="rounded-circle object-fit-cover"
                          style={{ border: '2px solid #dee2e6' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '50px' }}
                        >
                          <span className="text-white fw-bold">
                            {emp.firstName?.[0]}{emp.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-start">
                      <div className="fw-semibold">{emp.firstName} {emp.lastName}</div>
                      <small className="text-muted">{emp.customId}</small>
                    </td>
                    <td className="text-start">{emp.email}</td>
                    <td>{emp.phone || 'N/A'}</td>
                    <td>{emp.department || 'N/A'}</td>
                    <td>{emp.position || 'N/A'}</td>
                    <td className="text-start">
                      <div>{emp.city || 'N/A'}</div>
                      <small className="text-muted">{emp.state}, {emp.country}</small>
                    </td>
                    <td>{emp.gender || 'N/A'}</td>
                    <td>
                      {emp.resume ? (
                        <a
                          href={`http://localhost:5000/uploads/${emp.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-info"
                        >
                           View
                        </a>
                      ) : (
                        <span className="text-muted small">No File</span>
                      )}
                    </td>
                    <td>
                      {emp.status === 'active' || !emp.status ? (
                        <span className="badge bg-success"> Active</span>
                      ) : (
                        <span className="badge bg-secondary"> Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => onEdit(emp)}
                          title="Edit Employee"
                        >
                           Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(emp._id)}
                          title="Delete Employee"
                        >
                           Delete
                        </button>
                      </div>
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