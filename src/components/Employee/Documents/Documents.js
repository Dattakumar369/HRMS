import React, { useState } from 'react';
import { FaFileAlt, FaPaperclip } from 'react-icons/fa';
import './Documents.css';

const Documents = () => {
  const [documents] = useState([
    { id: 1, name: 'Employee Handbook', type: 'Company Document', category: 'Policy' },
    { id: 2, name: 'Code of Conduct', type: 'Company Document', category: 'Policy' },
    { id: 3, name: 'Benefits Guide', type: 'Company Document', category: 'Benefits' }
  ]);

  const [personalDocs] = useState([
    { id: 1, name: 'Resume.pdf', type: 'Personal', uploaded: '2024-01-15' },
    { id: 2, name: 'ID Proof.pdf', type: 'Personal', uploaded: '2024-01-10' }
  ]);

  return (
    <div className="documents">
      <div className="page-header">
        <h2>Documents</h2>
        <button className="btn-primary">+ Upload Document</button>
      </div>

      <div className="documents-sections">
        <div className="section-card">
          <h3>Company Documents</h3>
          <div className="documents-list">
            {documents.map(doc => (
              <div key={doc.id} className="document-item">
                <FaFileAlt className="doc-icon" />
                <div className="doc-info">
                  <h4>{doc.name}</h4>
                  <p>{doc.category}</p>
                </div>
                <button className="btn-view">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3>My Documents</h3>
          <div className="documents-list">
            {personalDocs.map(doc => (
              <div key={doc.id} className="document-item">
                <FaPaperclip className="doc-icon" />
                <div className="doc-info">
                  <h4>{doc.name}</h4>
                  <p>Uploaded: {new Date(doc.uploaded).toLocaleDateString()}</p>
                </div>
                <div className="doc-actions">
                  <button className="btn-view">View</button>
                  <button className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;

