import React, { useState, useEffect } from 'react';
import { Mail, Key, Plus, Trash2, RefreshCw } from 'lucide-react';

function EmployeeManagementTab({ token }) {
  const [admins, setAdmins] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/auth/admins', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data);
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) return;

    setAdminLoading(true);
    setAdminError('');
    setAdminSuccess('');

    try {
      const response = await fetch('/api/auth/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin');
      }

      setAdminSuccess(data.message);
      setAdminEmail('');
      setAdminPassword('');
      fetchAdmins(); // Refresh list
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee account?")) return;
    try {
      const response = await fetch(`/api/auth/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete');

      fetchAdmins();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.4rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        Employee / Admin Accounts
      </h3>

      {adminSuccess && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#16a34a', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
          {adminSuccess}
        </div>
      )}
      {adminError && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#ef4444', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
          {adminError}
        </div>
      )}

      {/* Add Admin Form */}
      <form onSubmit={handleAddAdmin} style={{
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
        backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px',
        padding: '1.5rem', marginBottom: '2.5rem'
      }}>
        <h4 style={{ margin: 0, color: '#334155', fontWeight: 600 }}>Create New Admin Account</h4>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Gmail / Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="employee@sebapoint.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={adminLoading}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            alignSelf: 'flex-end',
            padding: '0.6rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {adminLoading ? <RefreshCw size={16} className="spin-animation" /> : <><Plus size={16} /><span>Create Admin Account</span></>}
        </button>
      </form>

      {/* Admin Accounts List */}
      <div>
        <h4 style={{ color: '#334155', fontWeight: 600, marginBottom: '1rem' }}>Active Employee Credentials</h4>
        
        {admins.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No employee admin accounts registered yet.</p>
        ) : (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>Gmail / Email</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>Created Date</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((adm) => (
                  <tr key={adm._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>{adm.email}</td>
                    <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(adm.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteAdmin(adm._id)}
                        style={{
                          backgroundColor: '#fee2e2', color: '#ef4444', border: 'none',
                          padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer',
                          fontWeight: 600, fontSize: '0.85rem'
                        }}
                      >
                        Delete Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeManagementTab;
