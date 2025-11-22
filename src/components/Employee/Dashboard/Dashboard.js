import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser } from '../../../utils/dataInitializer';
import { getEmployeeAvatar, getInitials } from '../../../utils/avatarHelper';
import { format } from 'date-fns';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);

      // Today's attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const allAttendance = getStorageData('ems_attendance');
      const todayAttendance = allAttendance.find(a => 
        a.employeeId === emp?.id && a.date === today
      );
      setAttendance(todayAttendance);

      // Announcements
      const allAnnouncements = getStorageData('ems_announcements');
      const todayDate = new Date();
      const activeAnnouncements = allAnnouncements.filter(ann => {
        const validFrom = new Date(ann.validFrom);
        const validTo = new Date(ann.validTo);
        return todayDate >= validFrom && todayDate <= validTo;
      });
      setAnnouncements(activeAnnouncements.slice(0, 3));

      // Upcoming holidays
      const allHolidays = getStorageData('ems_holidays');
      const upcoming = allHolidays
        .filter(h => new Date(h.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setHolidays(upcoming);

      // Demo tasks
      setTasks([
        { id: 1, title: 'Complete project documentation', due: 'Today', status: 'Pending' },
        { id: 2, title: 'Team meeting preparation', due: 'Tomorrow', status: 'Ongoing' },
        { id: 3, title: 'Submit timesheet', due: 'This Week', status: 'Pending' }
      ]);
    }
  }, []);

  const handleClockIn = () => {
    if (!employee) return;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const allAttendance = getStorageData('ems_attendance');
    const existing = allAttendance.find(a => a.employeeId === employee.id && a.date === today);
    
    if (existing) {
      alert('You have already clocked in today');
      return;
    }

    const newEntry = {
      id: `att${Date.now()}`,
      employeeId: employee.id,
      date: today,
      clockIn: new Date().toISOString(),
      clockOut: null,
      status: 'Present',
      hours: 0
    };

    const updated = [...allAttendance, newEntry];
    sessionStorage.setItem('ems_attendance', JSON.stringify(updated));
    setAttendance(newEntry);
    alert('Clocked in successfully!');
  };

  const handleClockOut = () => {
    if (!attendance || !employee) return;
    
    const clockOut = new Date();
    const clockIn = new Date(attendance.clockIn);
    const hours = ((clockOut - clockIn) / (1000 * 60 * 60)).toFixed(2);

    const allAttendance = getStorageData('ems_attendance');
    const updated = allAttendance.map(a =>
      a.id === attendance.id
        ? { ...a, clockOut: clockOut.toISOString(), hours: parseFloat(hours) }
        : a
    );
    sessionStorage.setItem('ems_attendance', JSON.stringify(updated));
    setAttendance({ ...attendance, clockOut: clockOut.toISOString(), hours: parseFloat(hours) });
    alert('Clocked out successfully!');
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  const workHours = attendance?.hours || 0;
  const clockInTime = attendance?.clockIn ? format(new Date(attendance.clockIn), 'HH:mm') : null;
  const clockOutTime = attendance?.clockOut ? format(new Date(attendance.clockOut), 'HH:mm') : null;

  return (
    <div className="employee-dashboard">
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-avatar" onClick={() => setShowImageModal(true)} style={{ cursor: 'pointer' }}>
            <img
              src={getEmployeeAvatar(employee)}
              alt={employee.name}
              className="welcome-avatar-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="welcome-avatar-fallback" style={{ display: 'none' }}>
              {getInitials(employee.name)}
            </div>
          </div>
          <div className="welcome-text">
            <h2>Welcome, {employee.name}!</h2>
            <p>Here's your dashboard overview</p>
          </div>
        </div>
      </div>

      <div className="attendance-card">
        <h3>Today's Attendance</h3>
        <div className="attendance-status">
          <div className="status-info">
            <span className="status-label">Status:</span>
            <span className={`status-value ${attendance ? 'present' : 'absent'}`}>
              {attendance ? 'Present' : 'Not Clocked In'}
            </span>
          </div>
          {clockInTime && (
            <div className="time-info">
              <span>Clock In: {clockInTime}</span>
              {clockOutTime ? <span>Clock Out: {clockOutTime}</span> : null}
            </div>
          )}
          <div className="work-hours">
            <span>Work Hours: {workHours} hrs</span>
          </div>
        </div>
        <div className="attendance-actions">
          {!attendance?.clockIn && (
            <button onClick={handleClockIn} className="btn-clock-in">Clock In</button>
          )}
          {attendance?.clockIn && !attendance?.clockOut && (
            <button onClick={handleClockOut} className="btn-clock-out">Clock Out</button>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Announcements</h3>
          <div className="announcements-list">
            {announcements.length === 0 ? (
              <p className="no-data">No announcements</p>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className="announcement-item">
                  <div className={`ann-badge ${ann.type?.toLowerCase()}`}>{ann.type}</div>
                  <div className="ann-content">
                    <h4>{ann.title}</h4>
                    <p>{ann.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Holidays</h3>
          <div className="holidays-list">
            {holidays.length === 0 ? (
              <p className="no-data">No upcoming holidays</p>
            ) : (
              holidays.map(holiday => (
                <div key={holiday.id} className="holiday-item">
                  <div className="holiday-date">
                    {format(new Date(holiday.date), 'MMM dd')}
                  </div>
                  <div className="holiday-name">{holiday.name}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>My Tasks</h3>
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>Due: {task.due}</p>
                </div>
                <span className={`task-status ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Info</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">{employee.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Designation:</span>
              <span className="info-value">{employee.designation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Manager:</span>
              <span className="info-value">{employee.manager || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Employee ID:</span>
              <span className="info-value">{employee.employeeId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setShowImageModal(false)}>×</button>
            <img
              src={getEmployeeAvatar(employee)}
              alt={employee.name}
              className="image-modal-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="image-modal-fallback" style={{ display: 'none' }}>
              {getInitials(employee.name)}
            </div>
            <div className="image-modal-name">{employee.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;

