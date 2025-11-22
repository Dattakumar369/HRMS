import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import { format } from 'date-fns';
import './AttendanceManagement.css';

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = () => {
    setEmployees(getStorageData('ems_employees'));
    const allAttendance = getStorageData('ems_attendance');
    setAttendance(allAttendance.filter(a => a.date === selectedDate));
  };

  const handleClockIn = (employeeId) => {
    const existing = attendance.find(a => a.employeeId === employeeId && a.date === selectedDate);
    if (existing) {
      alert('Employee already clocked in today');
      return;
    }

    const newEntry = {
      id: `att${Date.now()}`,
      employeeId,
      date: selectedDate,
      clockIn: new Date().toISOString(),
      clockOut: null,
      status: 'Present',
      hours: 0
    };

    const allAttendance = getStorageData('ems_attendance');
    setStorageData('ems_attendance', [...allAttendance, newEntry]);
    loadData();
  };

  const handleClockOut = (attendanceId) => {
    const allAttendance = getStorageData('ems_attendance');
    const entry = allAttendance.find(a => a.id === attendanceId);
    if (entry) {
      const clockOut = new Date();
      const clockIn = new Date(entry.clockIn);
      const hours = (clockOut - clockIn) / (1000 * 60 * 60);

      const updated = allAttendance.map(a =>
        a.id === attendanceId
          ? { ...a, clockOut: clockOut.toISOString(), hours: hours.toFixed(2) }
          : a
      );
      setStorageData('ems_attendance', updated);
      loadData();
    }
  };

  const handleManualEntry = (entryData) => {
    const allAttendance = getStorageData('ems_attendance');
    const existing = allAttendance.find(
      a => a.employeeId === entryData.employeeId && a.date === entryData.date
    );

    if (existing) {
      const updated = allAttendance.map(a =>
        a.id === existing.id ? { ...a, ...entryData } : a
      );
      setStorageData('ems_attendance', updated);
    } else {
      const newEntry = {
        id: `att${Date.now()}`,
        ...entryData,
        status: entryData.clockIn ? 'Present' : 'Absent'
      };
      setStorageData('ems_attendance', [...allAttendance, newEntry]);
    }

    setShowManualEntry(false);
    loadData();
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp ? emp.name : 'Unknown';
  };

  return (
    <div className="attendance-management">
      <div className="page-header">
        <h2>Attendance Management</h2>
        <div className="header-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button onClick={() => setShowManualEntry(true)} className="btn-primary">
            + Manual Entry
          </button>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-box">
          <span className="stat-label">Total Employees:</span>
          <span className="stat-value">{employees.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Present:</span>
          <span className="stat-value present">{attendance.filter(a => a.status === 'Present').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Absent:</span>
          <span className="stat-value absent">{employees.length - attendance.filter(a => a.status === 'Present').length}</span>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const empAttendance = attendance.find(a => a.employeeId === emp.id);
              return (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>
                    {empAttendance?.clockIn
                      ? format(new Date(empAttendance.clockIn), 'HH:mm')
                      : '-'}
                  </td>
                  <td>
                    {empAttendance?.clockOut
                      ? format(new Date(empAttendance.clockOut), 'HH:mm')
                      : empAttendance?.clockIn
                      ? <button onClick={() => handleClockOut(empAttendance.id)} className="btn-clock-out">Clock Out</button>
                      : '-'}
                  </td>
                  <td>{empAttendance?.hours || '-'}</td>
                  <td>
                    <span className={`status-badge ${empAttendance?.status?.toLowerCase() || 'absent'}`}>
                      {empAttendance?.status || 'Absent'}
                    </span>
                  </td>
                  <td>
                    {!empAttendance?.clockIn && (
                      <button onClick={() => handleClockIn(emp.id)} className="btn-clock-in">
                        Clock In
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showManualEntry && (
        <ManualEntryForm
          employees={employees}
          date={selectedDate}
          onSave={handleManualEntry}
          onClose={() => setShowManualEntry(false)}
        />
      )}
    </div>
  );
};

const ManualEntryForm = ({ employees, date, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    clockIn: '',
    clockOut: '',
    status: 'Present'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      date,
      clockIn: formData.clockIn ? new Date(`${date}T${formData.clockIn}`).toISOString() : null,
      clockOut: formData.clockOut ? new Date(`${date}T${formData.clockOut}`).toISOString() : null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>Manual Attendance Entry</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee *</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Clock In Time</label>
            <input
              type="time"
              value={formData.clockIn}
              onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Clock Out Time</label>
            <input
              type="time"
              value={formData.clockOut}
              onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
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

export default AttendanceManagement;

