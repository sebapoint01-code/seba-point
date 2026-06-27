import React, { useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { FileSpreadsheet, BarChart3, Users, Settings, LogOut, Home, Menu, X as CloseIcon } from 'lucide-react';

function OwnerPanel({ user, onLogout, settings }) {
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
        backgroundColor: isActive ? 'rgba(239, 68, 68, 0.1)' : 'transparent', 
        color: isActive ? '#ef4444' : '#475569',
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
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#ef4444', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }} />
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
      
      {/* Top Banner (Glassmorphism Deep Red Theme) */}
      <div style={{
        background: 'rgba(69, 10, 10, 0.95)',
        backdropFilter: 'blur(12px)',
        color: '#ffffff',
        padding: '0.85rem 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
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
                {siteName} Owner
              </h1>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link 
              to="/home" 
              style={{ 
                color: '#fca5a5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#fca5a5'}
            >
              <Home size={16} />
              <span className="hidden-xs">View Site</span>
            </Link>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} className="hidden-xs" />

            {/* User Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
              }}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'O'}
              </div>
              <span className="hidden-xs" style={{ fontSize: '0.9rem', color: '#fca5a5', fontWeight: 500 }}>
                {user?.email}
              </span>
            </div>

            <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

            {/* Log Out */}
            <button 
              onClick={onLogout}
              style={{ 
                background: 'none', border: 'none', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.25rem', cursor: 'pointer', transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={(e) => e.currentTarget.style.color = '#fca5a5'}
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
        <aside className={`panel-sidebar ${isSidebarOpen ? 'open' : ''} no-print`} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '16px', padding: '1rem', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02), 0 8px 10px -6px rgba(0,0,0,0.02)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <NavItem to="/owner-panel" icon={FileSpreadsheet} label="Billing Portal" isActive={pathname === '/owner-panel'} />
            <NavItem to="/owner-panel/stats" icon={BarChart3} label="Invoice Statistics" isActive={pathname === '/owner-panel/stats'} />
            <NavItem to="/owner-panel/employees" icon={Users} label="Employee Management" isActive={pathname === '/owner-panel/employees'} />
            <NavItem to="/owner-panel/cms" icon={Settings} label="Global Settings" isActive={pathname.startsWith('/owner-panel/cms')} />
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

export default OwnerPanel;
