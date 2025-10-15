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

    useEffect(() => { fetchEmployees(); }, [refreshKey]);

    const handleSearch = async (e) => {
        e.preventDefault();
        await fetchEmployees();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return;
        try {
            await api.delete(`/${id}`);
            fetchEmployees();
        } catch (err) {
            console.error(err);
            alert('Delete failed');
        }
    };

    return (
        <div className="card p-3">
            <div className="d-flex justify-content-between mb-2">
                <h5 className="mb-0">Employees ({employees.length})</h5>
                <form className="d-flex" onSubmit={handleSearch}>
                    <input className="form-control form-control-sm" placeholder="Search name, email or city" value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="btn btn-sm btn-outline-primary ms-2" type="submit">Search</button>
                </form>
            </div>
            {loading ? <div>Loading...</div> : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th><th>Email</th><th>Mobile</th><th>City</th><th>Gender</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 && <tr><td colSpan="6">No employees found</td></tr>}
                            {employees.map(emp => (
                                <tr key={emp._id}>
                                    <td>{emp.firstName} {emp.lastName}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.mobile}</td>
                                    <td>{emp.city}</td>
                                    <td>{emp.gender}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2" onClick={() => onEdit(emp)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
