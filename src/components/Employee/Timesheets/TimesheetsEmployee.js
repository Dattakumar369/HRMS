import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser, setStorageData } from '../../../utils/dataInitializer';
import './TimesheetsEmployee.css';

const TimesheetsEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);

      if (emp) {
        const allTimesheets = getStorageData('ems_timesheets');
        setTimesheets(allTimesheets.filter(ts => ts.employeeId === emp.id));
      }
    }
  }, []);

  const handleSubmit = (timesheetData) => {
    const newTimesheet = {
      ...timesheetData,
      id: `ts${Date.now()}`,
      employeeId: employee.id,
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    };
    const allTimesheets = getStorageData('ems_timesheets');
    setStorageData('ems_timesheets', [...allTimesheets, newTimesheet]);
    setTimesheets([...timesheets, newTimesheet]);
    setShowForm(false);
  };

  return (
    <div className="timesheets-employee">
      <div className="page-header">
        <h2>My Timesheets</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Submit Timesheet</button>
      </div>

      <div className="timesheets-list">
        <table className="timesheets-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th>Billable</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(ts => (
              <tr key={ts.id}>
                <td>{new Date(ts.date).toLocaleDateString()}</td>
                <td>{ts.hours}</td>
                <td>{ts.billable ? 'Yes' : 'No'}</td>
                <td>{ts.description}</td>
                <td>
                  <span className={`status-badge ${ts.status?.toLowerCase()}`}>
                    {ts.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TimesheetForm
          onSave={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

const TimesheetForm = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    billable: false,
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      hours: parseFloat(formData.hours)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Submit Timesheet</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
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
            <label>Hours *</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.billable}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              />
              Billable
            </label>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetsEmployee;

