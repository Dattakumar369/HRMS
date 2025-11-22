import React, { useState, useEffect } from 'react';
import { getStorageData, setStorageData, getCurrentUser } from '../../../utils/dataInitializer';
import './AnnouncementsAdmin.css';

const AnnouncementsAdmin = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    const data = getStorageData('ems_announcements');
    setAnnouncements(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleAdd = () => {
    setEditingAnn(null);
    setShowForm(true);
  };

  const handleEdit = (ann) => {
    setEditingAnn(ann);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const updated = announcements.filter(a => a.id !== id);
      setStorageData('ems_announcements', updated);
      setAnnouncements(updated);
    }
  };

  const handleSave = (annData) => {
    const currentUser = getCurrentUser();
    if (editingAnn) {
      const updated = announcements.map(a =>
        a.id === editingAnn.id ? { ...annData, id: editingAnn.id, createdAt: a.createdAt } : a
      );
      setStorageData('ems_announcements', updated);
    } else {
      const newAnn = {
        ...annData,
        id: `ann${Date.now()}`,
        createdBy: currentUser?.id || 'admin1',
        createdAt: new Date().toISOString()
      };
      setStorageData('ems_announcements', [...announcements, newAnn]);
    }
    setShowForm(false);
    setEditingAnn(null);
    loadAnnouncements();
  };

  return (
    <div className="announcements-admin">
      <div className="page-header">
        <h2>Announcements</h2>
        <button onClick={handleAdd} className="btn-primary">+ Create Announcement</button>
      </div>

      <div className="announcements-grid">
        {announcements.map(ann => (
          <div key={ann.id} className="announcement-card">
            <div className="announcement-header">
              <div className={`priority-badge ${ann.type?.toLowerCase()}`}>{ann.type}</div>
              <div className="announcement-actions">
                <button onClick={() => handleEdit(ann)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(ann.id)} className="btn-delete">Delete</button>
              </div>
            </div>
            <h3 className="announcement-title">{ann.title}</h3>
            <p className="announcement-content">{ann.content}</p>
            <div className="announcement-footer">
              <span className="announcement-date">
                Valid: {new Date(ann.validFrom).toLocaleDateString()} - {new Date(ann.validTo).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AnnouncementForm
          announcement={editingAnn}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingAnn(null);
          }}
        />
      )}
    </div>
  );
};

const AnnouncementForm = ({ announcement, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Medium',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (announcement) {
      setFormData({
        ...announcement,
        validFrom: announcement.validFrom.split('T')[0],
        validTo: announcement.validTo.split('T')[0]
      });
    }
  }, [announcement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>{announcement ? 'Edit Announcement' : 'Create Announcement'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="5"
            />
          </div>
          <div className="form-group">
            <label>Priority Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Valid From *</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Valid To *</label>
              <input
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                required
              />
            </div>
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

export default AnnouncementsAdmin;

