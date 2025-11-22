import React, { useState, useEffect } from 'react';
import { getStorageData } from '../../../utils/dataInitializer';
import './AnnouncementsEmployee.css';

const AnnouncementsEmployee = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState({ type: '', date: '' });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    const allAnnouncements = getStorageData('ems_announcements');
    const today = new Date();
    const active = allAnnouncements.filter(ann => {
      const validFrom = new Date(ann.validFrom);
      const validTo = new Date(ann.validTo);
      return today >= validFrom && today <= validTo;
    });
    setAnnouncements(active.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const filtered = announcements.filter(ann => {
    if (filter.type && ann.type !== filter.type) return false;
    if (filter.date) {
      const annDate = new Date(ann.validFrom).toISOString().split('T')[0];
      if (annDate !== filter.date) return false;
    }
    return true;
  });

  return (
    <div className="announcements-employee">
      <div className="page-header">
        <h2>Announcements</h2>
        <div className="filters">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className="filter-date"
          />
        </div>
      </div>

      <div className="announcements-grid">
        {filtered.length === 0 ? (
          <p className="no-data">No announcements found</p>
        ) : (
          filtered.map(ann => (
            <div key={ann.id} className="announcement-card">
              <div className={`priority-badge ${ann.type?.toLowerCase()}`}>{ann.type}</div>
              <h3 className="announcement-title">{ann.title}</h3>
              <p className="announcement-content">{ann.content}</p>
              <div className="announcement-footer">
                <span className="announcement-date">
                  Valid: {new Date(ann.validFrom).toLocaleDateString()} - {new Date(ann.validTo).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsEmployee;

