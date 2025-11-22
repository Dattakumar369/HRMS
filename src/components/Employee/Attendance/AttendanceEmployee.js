import React, { useState, useEffect } from 'react';
import { getStorageData, getCurrentUser } from '../../../utils/dataInitializer';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import './AttendanceEmployee.css';

const AttendanceEmployee = () => {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const employees = getStorageData('ems_employees');
      const emp = employees.find(e => e.id === currentUser.id || e.email === currentUser.email);
      setEmployee(emp);

      if (emp) {
        const allAttendance = getStorageData('ems_attendance');
        const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
        const monthEnd = endOfMonth(new Date(selectedMonth + '-01'));
        const monthAttendance = allAttendance.filter(a =>
          a.employeeId === emp.id &&
          new Date(a.date) >= monthStart &&
          new Date(a.date) <= monthEnd
        );
        setAttendance(monthAttendance);
      }
    }
  }, [selectedMonth]);

  const getAttendanceForDate = (date) => {
    return attendance.find(a => isSameDay(new Date(a.date), date));
  };

  const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
  const monthEnd = endOfMonth(new Date(selectedMonth + '-01'));
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const totalHours = attendance.reduce((sum, a) => sum + (parseFloat(a.hours) || 0), 0);
  const presentDays = attendance.filter(a => a.status === 'Present').length;

  return (
    <div className="attendance-employee">
      <div className="page-header">
        <h2>My Attendance</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-input"
        />
      </div>

      <div className="attendance-stats">
        <div className="stat-box">
          <span className="stat-label">Present Days</span>
          <span className="stat-value">{presentDays}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Total Hours</span>
          <span className="stat-value">{totalHours.toFixed(2)}</span>
        </div>
      </div>

      <div className="attendance-calendar">
        <div className="calendar-grid">
          {daysInMonth.map(day => {
            const dayAttendance = getAttendanceForDate(day);
            return (
              <div
                key={day.toISOString()}
                className={`calendar-day ${dayAttendance ? dayAttendance.status.toLowerCase() : ''}`}
              >
                <div className="day-number">{format(day, 'd')}</div>
                {dayAttendance && (
                  <div className="day-status">
                    {dayAttendance.clockIn && (
                      <span className="time">{format(new Date(dayAttendance.clockIn), 'HH:mm')}</span>
                    )}
                    {dayAttendance.clockOut && (
                      <span className="time">{format(new Date(dayAttendance.clockOut), 'HH:mm')}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="attendance-log">
        <h3>Attendance Log</h3>
        <table className="log-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(att => (
              <tr key={att.id}>
                <td>{format(new Date(att.date), 'MMM dd, yyyy')}</td>
                <td>{att.clockIn ? format(new Date(att.clockIn), 'HH:mm') : '-'}</td>
                <td>{att.clockOut ? format(new Date(att.clockOut), 'HH:mm') : '-'}</td>
                <td>{att.hours || '-'}</td>
                <td>
                  <span className={`status-badge ${att.status?.toLowerCase()}`}>
                    {att.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceEmployee;

