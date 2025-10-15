import React, { useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';

function App(){
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-5">
          <EmployeeForm editing={editing} onSaved={() => { setEditing(null); triggerRefresh(); }} onCancel={() => setEditing(null)} />
        </div>
        <div className="col-md-7">
          <EmployeeList onEdit={setEditing} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}

export default App;
