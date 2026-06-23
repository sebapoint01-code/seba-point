import React, { useState, useEffect } from 'react';
import { Shield, Users, BarChart3, Edit, FileSpreadsheet, Plus, Trash2, Key, Mail, RefreshCw, Sparkles, DollarSign } from 'lucide-react';
import AdminPanel from './AdminPanel';

function OwnerPanel({ 
  token, 
  user, 
  onNavigate, 
  onLogout,
  initialConfig,
  initialServices,
  onRefreshConfig,
  onRefreshServices,
  // Billing props
  invoices,
  dbState,
  onRefreshInvoices,
  onEditInvoice,
  onCreateInvoice
}) {
  const [ownerTab, setOwnerTab] = useState('billing'); // 'billing', 'stats', 'employees', 'cms'
  
  // Employee Management State
  const [admins, setAdmins] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Fetch Admins
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
    if (ownerTab === 'employees') {
      fetchAdmins();
    }
  }, [ownerTab]);

  // Create new Admin Account
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

  // Delete Admin Account
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

  // Generate Month-Over-Month Invoice Stats
  const generateStats = () => {
    const statsMap = {};
    let totalRevenue = 0;
    
    invoices.forEach(inv => {
      if (!inv.createdAt) return;
      const date = new Date(inv.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!statsMap[monthYear]) {
        statsMap[monthYear] = { revenue: 0, count: 0 };
      }
      
      const invTotal = inv.items?.reduce((sum, item) => sum + (item.quantity * item.rate), 0) || 0;
      statsMap[monthYear].revenue += invTotal;
      statsMap[monthYear].count += 1;
      totalRevenue += invTotal;
    });

    const statsArray = Object.keys(statsMap).map(month => ({
      month,
      revenue: statsMap[month].revenue,
      count: statsMap[month].count
    })).sort((a, b) => {
      // Sort chronologically by converting Month Year back to Date
      return new Date(a.month) - new Date(b.month);
    });

    // Find the max revenue month to scale the horizontal visual graph bars
    const maxRevenue = Math.max(...statsArray.map(s => s.revenue), 1);

    return { statsArray, totalRevenue, maxRevenue };
  };

  const { statsArray, totalRevenue, maxRevenue } = generateStats();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      paddingTop: '5.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Top Banner */}
      <div style={{
        backgroundColor: '#020617',
        color: '#ffffff',
        padding: '2.5rem 2rem',
        borderBottom: '4px solid #ef4444'
      }} className="no-print">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>OWNER</span>
              <h1 style={{ fontSize: '1.75rem', color: 'white', fontFamily: 'var(--font-display)', margin: 0 }}>
                Owner Control Center
              </h1>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Primary Administrator Account: <strong style={{ color: '#cbd5e1' }}>{user?.email}</strong>
            </p>
          </div>
          
          <button 
            className="btn"
            onClick={onLogout}
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1.5rem' }}
          >
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="no-print">
          <button 
            onClick={() => setOwnerTab('billing')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: ownerTab === 'billing' ? '#ef4444' : 'white', color: ownerTab === 'billing' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <FileSpreadsheet size={18} />
            <span>Billing Portal</span>
          </button>
          
          <button 
            onClick={() => setOwnerTab('stats')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: ownerTab === 'stats' ? '#ef4444' : 'white', color: ownerTab === 'stats' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <BarChart3 size={18} />
            <span>Invoice Statistics</span>
          </button>

          <button 
            onClick={() => setOwnerTab('employees')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: ownerTab === 'employees' ? '#ef4444' : 'white', color: ownerTab === 'employees' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Users size={18} />
            <span>Employee Management</span>
          </button>

          <button 
            onClick={() => setOwnerTab('cms')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: ownerTab === 'cms' ? '#ef4444' : 'white', color: ownerTab === 'cms' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Settings size={18} />
            <span>Website Settings CMS</span>
          </button>
        </aside>

        {/* Content Pane */}
        <main style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem'
        }}>

          {/* TAB 1: BILLING PORTAL */}
          {ownerTab === 'billing' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: 0 }}>Billing Panel</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => onNavigate('dashboard')} 
                    style={{ padding: '0.5rem 1.25rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Manage Invoices
                  </button>
                  <button 
                    onClick={onCreateInvoice} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1.25rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Plus size={16} /> New Invoice
                  </button>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>All-Time Revenue</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14532d', marginTop: '0.25rem' }}>৳{totalRevenue.toLocaleString()}</div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>Total Invoices Issued</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.25rem' }}>{invoices.length}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                  Click **Manage Invoices** above to search, edit, print, or review detailed invoice history and billing client information.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICE STATISTICS */}
          {ownerTab === 'stats' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Invoice Statistics & Monthly Sales
              </h3>
              
              {statsArray.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
                  <BarChart3 size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
                  <p>No invoice data available to generate statistics.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Total stats card */}
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Billings Accumulation</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 850, color: '#ef4444', marginTop: '0.25rem' }}>৳{totalRevenue.toLocaleString()}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Average Monthly Sales</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 850, color: '#0f172a', marginTop: '0.25rem' }}>৳{Math.round(totalRevenue / statsArray.length).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart representation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h4 style={{ color: '#334155', fontWeight: 600, fontSize: '1.1rem' }}>Month-over-Month Revenue Chart</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {statsArray.map((item, index) => {
                        const pct = (item.revenue / maxRevenue) * 100;
                        return (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            {/* Month Label */}
                            <div style={{ width: '130px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>
                              {item.month}
                            </div>
                            
                            {/* Visual Bar Container */}
                            <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${pct}%`,
                                backgroundColor: '#ef4444',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '0.75rem',
                                color: 'white',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                borderRadius: '4px',
                                minWidth: 'fit-content'
                              }}>
                                ৳{item.revenue.toLocaleString()}
                              </div>
                            </div>
                            
                            {/* Invoice Count */}
                            <div style={{ width: '90px', color: '#64748b', fontSize: '0.85rem', textAlign: 'right' }}>
                              {item.count} invoice{item.count > 1 ? 's' : ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMPLOYEE MANAGEMENT */}
          {ownerTab === 'employees' && (
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
          )}

          {/* TAB 4: CMS WRAPPER */}
          {ownerTab === 'cms' && (
            <AdminPanel 
              token={token} 
              user={user} 
              onNavigate={onNavigate} 
              onLogout={onLogout}
              initialConfig={initialConfig}
              initialServices={initialServices}
              onRefreshConfig={onRefreshConfig}
              onRefreshServices={onRefreshServices}
            />
          )}

        </main>

      </div>

    </div>
  );
}

export default OwnerPanel;
