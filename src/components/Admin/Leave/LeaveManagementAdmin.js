import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import './LeaveManagementAdmin.css';

const LeaveManagementAdmin = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [showHolidayForm, setShowHolidayForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLeaves(getStorageData('ems_leaves'));
    setEmployees(getStorageData('ems_employees'));
    setHolidays(getStorageData('ems_holidays'));
  };

  const handleApprove = (id) => {
    const updated = leaves.map(l =>
      l.id === id ? { ...l, status: 'Approved' } : l
    );
    setStorageData('ems_leaves', updated);
    loadData();
  };

  const handleReject = (id) => {
    const updated = leaves.map(l =>
      l.id === id ? { ...l, status: 'Rejected' } : l
    );
    setStorageData('ems_leaves', updated);
    loadData();
  };

  const handleAddHoliday = (holidayData) => {
    const newHoliday = { ...holidayData, id: `hol${Date.now()}` };
    setStorageData('ems_holidays', [...holidays, newHoliday]);
    setShowHolidayForm(false);
    loadData();
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name : 'Unknown';
  };

  return (
    <div className="leave-management-admin">
      <div className="page-header">
        <h2>Leave Management</h2>
        <button onClick={() => setShowHolidayForm(true)} className="btn-primary">
          + Add Holiday
        </button>
      </div>

      <div className="leave-sections">
        <div className="section-card">
          <h3>Leave Requests</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(leave => (
                  <tr key={leave.id}>
                    <td>{getEmployeeName(leave.employeeId)}</td>
                    <td>{leave.type}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td>{leave.days}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status-badge ${leave.status?.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'Pending' && (
                        <div className="action-buttons">
                          <button onClick={() => handleApprove(leave.id)} className="btn-approve">Approve</button>
                          <button onClick={() => handleReject(leave.id)} className="btn-reject">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card">
          <h3>Holiday Calendar</h3>
          <div className="holidays-list">
            {holidays.map(holiday => (
              <div key={holiday.id} className="holiday-item">
                <div className="holiday-date">
                  {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="holiday-info">
                  <p className="holiday-name">{holiday.name}</p>
                  <p className="holiday-type">{holiday.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showHolidayForm && (
        <HolidayForm
          onSave={handleAddHoliday}
          onClose={() => setShowHolidayForm(false)}
        />
      )}
    </div>
  );
};

const HolidayForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'National'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Add Holiday</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Holiday Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="National">National</option>
              <option value="Regional">Regional</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveManagementAdmin;

