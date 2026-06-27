import React, { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, Image, FileText, Edit, ShieldAlert, LogOut, Home, Menu, X as CloseIcon } from 'lucide-react';

function AdminPanel({ token, user, onLogout, settings }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const siteLogo = settings?.logo || '/logo.png';
  const siteName = settings?.siteName || 'SebaPoint';

  const NavItem = ({ to, icon: Icon, label, isActive }) => (
    <Link 
      to={to}
      onClick={() => setIsSidebarOpen(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem 1.25rem', 
        border: 'none', borderRadius: '12px',
        backgroundColor: isActive ? 'rgba(22, 163, 74, 0.1)' : 'transparent', 
        color: isActive ? '#16a34a' : '#475569',
        fontWeight: isActive ? 700 : 600, cursor: 'pointer', textAlign: 'left', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(241, 245, 249, 0.8)'; }}
      onMouseOut={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {isActive && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#16a34a', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }} />
      )}
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        color: '#ffffff',
        padding: '0.85rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }} className="no-print">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md-menu-toggle"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'none', // Shown on mobile via CSS media query
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isSidebarOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
            <div style={{ backgroundColor: 'white', padding: '0.3rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={siteLogo} alt={siteName} style={{ height: '30px', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', color: 'white', fontFamily: 'var(--font-display)', margin: 0, fontWeight: 700 }}>
                {siteName} Admin
              </h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link 
              to="/home" 
              style={{ 
                color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              <Home size={16} />
              <span className="hidden-xs">View Site</span>
            </Link>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="hidden-xs" />

            {/* User Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#16a34a', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)'
              }}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="hidden-xs" style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500 }}>
                {user?.email}
              </span>
            </div>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

            {/* Log Out */}
            <button 
              onClick={onLogout}
              style={{ 
                background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.25rem', cursor: 'pointer', transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
              title="Log Out"
            >
              <LogOut size={18} />
              <span className="hidden-xs" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Backdrop Overlay on mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            top: '62px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998,
            backdropFilter: 'blur(2px)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      <div className="panel-container" style={{ maxWidth: '1600px', margin: '2rem auto', padding: '0 2rem', gap: '2rem' }}>
        
        {/* Navigation Sidebar */}
        <aside className={`panel-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '16px', padding: '1rem', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <NavItem to="/admin-panel" icon={Image} label="Slider & Logo" isActive={pathname === '/admin-panel'} />
            <NavItem to="/admin-panel/pages" icon={Settings} label="Footer & Pages" isActive={pathname === '/admin-panel/pages'} />
            <NavItem to="/seo-headers-cms" icon={FileText} label="SEO & Headers" isActive={pathname === '/seo-headers-cms'} />
            <NavItem to="/admin-panel/services" icon={Edit} label="Service Cards" isActive={pathname === '/admin-panel/services'} />
          </div>

          {/* Link to Owner Login */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            background: 'linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '1px solid rgba(254, 205, 211, 0.4)',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.03)'
          }}>
            <ShieldAlert size={26} style={{ color: '#e11d48', marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.9rem', color: '#9f1239', marginBottom: '0.35rem', fontWeight: 700 }}>Owner Portal</h4>
            <p style={{ fontSize: '0.75rem', color: '#be123c', lineHeight: '1.4', marginBottom: '1rem' }}>
              {user?.role === 'owner' ? 'Access Billing, Stats, and Employee Management.' : 'Are you the business owner? Log in to view Executive controls.'}
            </p>
            <button 
              onClick={() => {
                setIsSidebarOpen(false);
                navigate(user?.role === 'owner' ? '/owner-panel' : '/ownerlogin');
              }}
              style={{
                width: '100%', padding: '0.65rem', backgroundColor: '#e11d48', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.15)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#be123c'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e11d48'}
            >
              {user?.role === 'owner' ? 'Go to Owner Panel' : 'Go to Owner Login'}
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="panel-content-pane" style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)',
          padding: '2.5rem',
          minHeight: '600px'
        }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminPanel;
