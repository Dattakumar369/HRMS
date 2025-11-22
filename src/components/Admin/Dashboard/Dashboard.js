import React, { useState, useEffect } from 'react';
import { getStorageData } from '../../../utils/dataInitializer';
import { getSmallAvatar, getInitials } from '../../../utils/avatarHelper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaClipboardList } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
    pendingTasks: 0
  });

  const [departmentData, setDepartmentData] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const employees = getStorageData('ems_employees');
    const departments = getStorageData('ems_departments');
    const attendance = getStorageData('ems_attendance');
    const holidays = getStorageData('ems_holidays');
    const announcementsData = getStorageData('ems_announcements');

    // Calculate stats
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const inactive = total - active;

    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const present = todayAttendance.filter(a => a.status === 'Present').length;
    const absent = total - present;

    // Department-wise employee count
    const deptData = departments.map(dept => ({
      name: dept.name,
      employees: dept.employeeCount || 0
    }));

    // Recent employees (last 5)
    const recent = [...employees]
      .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
      .slice(0, 5);

    // Upcoming holidays
    const upcoming = holidays
      .filter(h => new Date(h.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    // Recent announcements
    const recentAnnouncements = [...announcementsData]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setStats({
      totalEmployees: total,
      activeEmployees: active,
      inactiveEmployees: inactive,
      todayPresent: present,
      todayAbsent: absent,
      pendingTasks: 5 // Demo value
    });

    setDepartmentData(deptData);
    setRecentEmployees(recent);
    setUpcomingHolidays(upcoming);
    setAnnouncements(recentAnnouncements);
  }, []);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <h3>{stats.activeEmployees}</h3>
            <p>Active Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><FaTimesCircle /></div>
          <div className="stat-content">
            <h3>{stats.inactiveEmployees}</h3>
            <p>Inactive Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><FaCalendarAlt /></div>
          <div className="stat-content">
            <h3>{stats.todayPresent}</h3>
            <p>Today Present</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-content">
            <h3>{stats.todayAbsent}</h3>
            <p>Today Absent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><FaClipboardList /></div>
          <div className="stat-content">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Department-wise Employees</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>Active vs Inactive</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Active', value: stats.activeEmployees },
                  { name: 'Inactive', value: stats.inactiveEmployees }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[stats.activeEmployees, stats.inactiveEmployees].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>Recently Joined Employees</h3>
          <div className="employee-list">
            {recentEmployees.map(emp => (
              <div key={emp.id} className="employee-item">
                <div className="employee-avatar">
                  <img
                    src={getSmallAvatar(emp)}
                    alt={emp.name}
                    className="employee-avatar-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="employee-avatar-fallback" style={{ display: 'none' }}>
                    {getInitials(emp.name)}
                  </div>
                </div>
                <div className="employee-info">
                  <p className="employee-name">{emp.name}</p>
                  <p className="employee-dept">{emp.department}</p>
                </div>
                <div className="employee-date">{new Date(emp.joiningDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Holidays</h3>
          <div className="holiday-list">
            {upcomingHolidays.map(holiday => (
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

        <div className="dashboard-card">
          <h3>Recent Announcements</h3>
          <div className="announcement-list">
            {announcements.map(ann => (
              <div key={ann.id} className="announcement-item">
                <div className={`announcement-badge ${ann.type.toLowerCase()}`}>{ann.type}</div>
                <div className="announcement-content">
                  <p className="announcement-title">{ann.title}</p>
                  <p className="announcement-text">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

