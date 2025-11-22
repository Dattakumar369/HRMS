import React, { useState } from 'react';
import { getStorageData, setStorageData } from '../../../utils/dataInitializer';
import './Settings.css';

const Settings = () => {
  const [orgInfo, setOrgInfo] = useState({
    name: 'Employee Management System',
    address: '123 Business Street',
    phone: '+1 234 567 8900',
    email: 'contact@ems.com'
  });

  const handleSaveOrgInfo = () => {
    setStorageData('ems_orgInfo', orgInfo);
    alert('Organization information saved!');
  };

  const handleBackup = () => {
    const data = {
      employees: getStorageData('ems_employees'),
      departments: getStorageData('ems_departments'),
      teams: getStorageData('ems_teams'),
      attendance: getStorageData('ems_attendance'),
      timesheets: getStorageData('ems_timesheets'),
      leaves: getStorageData('ems_leaves'),
      announcements: getStorageData('ems_announcements'),
      performance: getStorageData('ems_performance')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ems_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          Object.keys(data).forEach(key => {
            setStorageData(`ems_${key}`, data[key]);
          });
          alert('Data restored successfully! Please refresh the page.');
        } catch (error) {
          alert('Error restoring data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="settings">
      <div className="page-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-sections">
        <div className="settings-card">
          <h3>Organization Information</h3>
          <div className="form-group">
            <label>Organization Name</label>
            <input
              type="text"
              value={orgInfo.name}
              onChange={(e) => setOrgInfo({ ...orgInfo, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={orgInfo.address}
              onChange={(e) => setOrgInfo({ ...orgInfo, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={orgInfo.phone}
              onChange={(e) => setOrgInfo({ ...orgInfo, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={orgInfo.email}
              onChange={(e) => setOrgInfo({ ...orgInfo, email: e.target.value })}
            />
          </div>
          <button onClick={handleSaveOrgInfo} className="btn-save">Save</button>
        </div>

        <div className="settings-card">
          <h3>Data Management</h3>
          <div className="data-actions">
            <button onClick={handleBackup} className="btn-backup">Backup Data</button>
            <label className="btn-restore">
              Restore Data
              <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
            </label>
          </div>
          <p className="info-text">Backup and restore your system data. Backup creates a JSON file that can be restored later.</p>
        </div>

        <div className="settings-card">
          <h3>Theme Settings</h3>
          <div className="theme-options">
            <button className="theme-btn active">Light</button>
            <button className="theme-btn">Dark</button>
          </div>
          <p className="info-text">Theme settings (Demo - will be functional in full version)</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

