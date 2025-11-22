import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser, setStorageData } from '../../../utils/dataInitializer';
import './LeaveEmployee.css';

const LeaveEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [leaveBalance] = useState({ total: 20, used: 5, remaining: 15 });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);

      if (emp) {
        const allLeaves = getStorageData('ems_leaves');
        setLeaves(allLeaves.filter(l => l.employeeId === emp.id));
        setHolidays(getStorageData('ems_holidays'));
      }
    }
  }, []);

  const handleApplyLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `leave${Date.now()}`,
      employeeId: employee.id,
      status: 'Pending',
      appliedAt: new Date().toISOString()
    };
    const allLeaves = getStorageData('ems_leaves');
    setStorageData('ems_leaves', [...allLeaves, newLeave]);
    setLeaves([...leaves, newLeave]);
    setShowForm(false);
  };

  return (
    <div className="leave-employee">
      <div className="page-header">
        <h2>Leave Management</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Apply Leave</button>
      </div>

      <div className="leave-balance">
        <div className="balance-card">
          <h3>Leave Balance</h3>
          <div className="balance-stats">
            <div className="balance-item">
              <span className="balance-label">Total</span>
              <span className="balance-value">{leaveBalance.total}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">Used</span>
              <span className="balance-value">{leaveBalance.used}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">Remaining</span>
              <span className="balance-value remaining">{leaveBalance.remaining}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="leave-sections">
        <div className="section-card">
          <h3>My Leave Requests</h3>
          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section-card">
          <h3>Holiday Calendar</h3>
          <div className="holidays-list">
            {holidays.map(holiday => (
              <div key={holiday.id} className="holiday-item">
                <div className="holiday-date">
                  {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

      {showForm && (
        <LeaveForm
          onSave={handleApplyLeave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

const LeaveForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  const calculateDays = () => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      days: calculateDays()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Apply Leave</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Vacation">Vacation</option>
              <option value="Personal">Personal</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div className="form-group">
            <label>From Date *</label>
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>To Date *</label>
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Days</label>
            <input type="text" value={calculateDays()} disabled />
          </div>
          <div className="form-group">
            <label>Reason *</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Apply</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveEmployee;

