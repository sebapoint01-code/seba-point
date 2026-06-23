import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, Image, FileText, Edit, ShieldAlert } from 'lucide-react';

function AdminPanel({ token, user, onLogout }) {
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
      
      {/* Banner */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '2.5rem 2rem',
        borderBottom: '4px solid #16a34a'
      }} className="no-print">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>CMS</span>
              <h1 style={{ fontSize: '1.75rem', color: 'white', fontFamily: 'var(--font-display)', margin: 0 }}>
                Website Management Panel
              </h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Logged in as: <strong style={{ color: '#cbd5e1' }}>{user?.email}</strong> (Role: <span style={{ textTransform: 'capitalize', color: '#16a34a', fontWeight: 'bold' }}>{user?.role}</span>)
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/home" 
              className="btn btn-secondary" 
              style={{ backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <span>View Public Site</span>
            </Link>
            <button 
              className="btn btn-secondary"
              onClick={onLogout}
              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="no-print">
          <Link 
            to="/admin-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/admin-panel' ? '#16a34a' : 'white', color: pathname === '/admin-panel' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <Image size={18} />
            <span>Slider & Logo CMS</span>
          </Link>
          
          <Link 
            to="/admin-panel/pages"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/admin-panel/pages' ? '#16a34a' : 'white', color: pathname === '/admin-panel/pages' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <Settings size={18} />
            <span>Footer & Pages CMS</span>
          </Link>

          <Link 
            to="/seo-headers-cms"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/seo-headers-cms' ? '#16a34a' : 'white', color: pathname === '/seo-headers-cms' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <FileText size={18} />
            <span>SEO & Headers CMS</span>
          </Link>

          <Link 
            to="/admin-panel/services"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: pathname === '/admin-panel/services' ? '#16a34a' : 'white', color: pathname === '/admin-panel/services' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s',
              textDecoration: 'none'
            }}
          >
            <Edit size={18} />
            <span>Service Cards CRUD</span>
          </Link>

          {/* Section: Link to Owner Login */}
          <div style={{
            marginTop: '3rem',
            padding: '1.25rem',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <ShieldAlert size={24} style={{ color: '#f43f5e', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.85rem', color: '#881337', marginBottom: '0.5rem' }}>Owner Control Panel</h4>
            <p style={{ fontSize: '0.75rem', color: '#9f1239', lineHeight: '1.4', marginBottom: '1rem' }}>
              {user?.role === 'owner' ? 'Return to your Owner dashboard containing Billing, Stats, and Employees.' : 'Are you the business owner? Log in to view Billing, Stats, and Employee controls.'}
            </p>
            <button 
              onClick={() => navigate(user?.role === 'owner' ? '/owner-panel' : '/ownerlogin')}
              style={{
                width: '100%', padding: '0.5rem', backgroundColor: '#f43f5e', color: 'white',
                border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {user?.role === 'owner' ? 'Go to Owner Panel' : 'Go to Owner Login'}
            </button>
          </div>
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

export default AdminPanel;
