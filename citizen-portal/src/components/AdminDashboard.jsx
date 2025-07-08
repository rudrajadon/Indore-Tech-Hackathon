import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapDisplay from './MapDisplay';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard({ onBack }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [editRemarks, setEditRemarks] = useState({});

  async function fetchReports() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(BACKEND_URL + '/api/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function handleUpdate(reportId, status, adminRemarks) {
    setUpdating(reportId);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        BACKEND_URL + `/api/reports/${reportId}`,
        { status, adminRemarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(reports.map(r => r._id === reportId ? res.data.report : r));
      setEditRemarks(prev => {
        const newState = { ...prev };
        delete newState[reportId];
        return newState;
      });
    } catch (err) {
      alert('Failed to update report');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#1565c0', marginBottom: 18 }}>Admin Dashboard</h2>
      <button onClick={onBack} style={{ marginBottom: 16 }}>Back</button>
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {reports.map(r => (
            <div key={r._id} style={{ borderRadius: 12, background: '#fff', boxShadow: '0 2px 10px 0 rgba(0,0,0,0.07)', padding: 18, borderLeft: `5px solid ${r.status === 'pending' ? '#ffb300' : r.status === 'resolved' ? '#43a047' : '#1976d2'}`, marginBottom: 8 }}>
              <div><b>User:</b> {r.user?.email || 'N/A'}</div>
              <div><b>Description:</b> {r.description}</div>
              <div><b>Address:</b> {r.address}</div>
              <div><b>Location:</b> Lat: {r.location?.lat}, Lng: {r.location?.lng}</div>
              <MapDisplay lat={r.location?.lat} lng={r.location?.lng} />
              <div><b>Created:</b> {new Date(r.createdAt).toLocaleString()}</div>
              {r.photo && <img src={BACKEND_URL + r.photo} alt="Report" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 7, marginTop: 10, boxShadow: '0 1px 4px #ccc', border: '1px solid #eee', display: 'block' }} />}
              <div style={{ marginTop: 10 }}>
                <label>Status: </label>
                <select value={r.status} disabled={updating === r._id} onChange={e => handleUpdate(r._id, e.target.value, editRemarks[r._id] !== undefined ? editRemarks[r._id] : (r.adminRemarks || ''))}>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div style={{ marginTop: 10 }}>
                <label>Admin Remarks: </label>
                <input
                  type="text"
                  value={editRemarks[r._id] !== undefined ? editRemarks[r._id] : (r.adminRemarks || '')}
                  disabled={updating === r._id}
                  onChange={e => setEditRemarks({ ...editRemarks, [r._id]: e.target.value })}
                  style={{ width: 200 }}
                />
                <button
                  style={{ marginLeft: 8 }}
                  disabled={updating === r._id}
                  onClick={() => handleUpdate(r._id, r.status, editRemarks[r._id] !== undefined ? editRemarks[r._id] : (r.adminRemarks || ''))}
                >
                  {updating === r._id ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 