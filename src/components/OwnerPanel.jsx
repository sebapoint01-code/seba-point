import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { FileSpreadsheet, BarChart3, Users, Settings } from 'lucide-react';

function OwnerPanel({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

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
          <Link 
            to="/owner-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/owner-panel' ? '#ef4444' : 'white', color: pathname === '/owner-panel' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <FileSpreadsheet size={18} />
            <span>Billing Portal</span>
          </Link>
          
          <Link 
            to="/owner-panel/stats"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/owner-panel/stats' ? '#ef4444' : 'white', color: pathname === '/owner-panel/stats' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <BarChart3 size={18} />
            <span>Invoice Statistics</span>
          </Link>

          <Link 
            to="/owner-panel/employees"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/owner-panel/employees' ? '#ef4444' : 'white', color: pathname === '/owner-panel/employees' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <Users size={18} />
            <span>Employee Management</span>
          </Link>

          <Link 
            to="/owner-panel/cms"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname.startsWith('/owner-panel/cms') ? '#ef4444' : 'white', color: pathname.startsWith('/owner-panel/cms') ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <Settings size={18} />
            <span>Website Settings CMS</span>
          </Link>
        </aside>

        {/* Content Pane */}
        <main style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          padding: '2.5rem'
        }}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default OwnerPanel;
