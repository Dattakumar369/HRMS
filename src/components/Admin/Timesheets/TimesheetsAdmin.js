import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import './TimesheetsAdmin.css';

const TimesheetsAdmin = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState({ employeeId: '', status: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTimesheets(getStorageData('ems_timesheets'));
    setEmployees(getStorageData('ems_employees'));
  };

  const handleApprove = (id) => {
    const updated = timesheets.map(ts =>
      ts.id === id ? { ...ts, status: 'Approved' } : ts
    );
    setStorageData('ems_timesheets', updated);
    loadData();
  };

  const handleReject = (id) => {
    const updated = timesheets.map(ts =>
      ts.id === id ? { ...ts, status: 'Rejected' } : ts
    );
    setStorageData('ems_timesheets', updated);
    loadData();
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Unknown';
  };

  const filtered = timesheets.filter(ts => {
    if (filter.employeeId && ts.employeeId !== filter.employeeId) return false;
    if (filter.status && ts.status !== filter.status) return false;
    return true;
  });

  return (
    <div className="timesheets-admin">
      <div className="page-header">
        <h2>Timesheets Management</h2>
      </div>

      <div className="filters">
        <select
          value={filter.employeeId}
          onChange={(e) => setFilter({ ...filter, employeeId: e.target.value })}
          className="filter-select"
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="timesheets-table-container">
        <table className="timesheets-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Billable</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ts => (
              <tr key={ts.id}>
                <td>{getEmployeeName(ts.employeeId)}</td>
                <td>{new Date(ts.date).toLocaleDateString()}</td>
                <td>{ts.hours}</td>
                <td>{ts.billable ? 'Yes' : 'No'}</td>
                <td>{ts.description}</td>
                <td>
                  <span className={`status-badge ${ts.status?.toLowerCase()}`}>
                    {ts.status}
                  </span>
                </td>
                <td>
                  {ts.status === 'Submitted' && (
                    <div className="action-buttons">
                      <button onClick={() => handleApprove(ts.id)} className="btn-approve">Approve</button>
                      <button onClick={() => handleReject(ts.id)} className="btn-reject">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimesheetsAdmin;

