import React, { useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setEditing(null);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const handleEdit = (employee) => {
    setEditing(employee);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditing(null);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="mb-1 h3">Employee Management System</h1>
              <p className="mb-0 small opacity-75">BarodaWeb IT Company</p>
            </div>
            <div className="text-end">
              <div className="badge bg-light text-primary fs-6">
                Total Records: {refreshKey}+
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            {/* Employee Form */}
            <EmployeeForm
              editing={editing}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </div>

          <div className="col-12">
            {/* Employee List */}
            <EmployeeList
              onEdit={handleEdit}
              refreshKey={refreshKey}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <p className="mb-0 small">
            © 2025 Employee Management System | Pankaj Mishra
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;