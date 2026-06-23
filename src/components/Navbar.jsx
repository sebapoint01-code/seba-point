import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, Shield, Menu, X } from 'lucide-react';

function Navbar({ settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contacts' }
  ];

  const siteLogo = settings?.logo || '/logo.png';

  const isActive = (path) => {
    if (path === '/home' && (pathname === '/' || pathname === '/home')) return true;
    return pathname === path;
  };

  return (
    <header className="landing-header no-print" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(22, 163, 74, 0.1)' : '1px solid #e2e8f0',
      padding: isScrolled ? '0.5rem 0' : '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        
        {/* Logo */}
        <Link 
          to="/home"
          onClick={() => setMobileMenuOpen(false)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <img 
            src={siteLogo} 
            alt={settings?.siteName || "SebaPoint Logo"} 
            style={{ 
              height: isScrolled ? '50px' : '65px', 
              transition: 'height 0.3s ease',
              objectFit: 'contain' 
            }} 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          <div style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    color: active ? '#16a34a' : '#475569',
                    fontWeight: active ? 700 : 500,
                    fontSize: '1rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => { if (!active) e.target.style.color = '#ef4444'; }}
                  onMouseOut={(e) => { if (!active) e.target.style.color = '#475569'; }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" style={{ display: 'none' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X size={28} color="#ef4444" cursor="pointer" /> : <Menu size={28} color="#16a34a" cursor="pointer" />}
        </div>

      </div>
      
      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(22, 163, 74, 0.1)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
          zIndex: 999
        }}>
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: active ? '#16a34a' : '#475569',
                  fontWeight: active ? 700 : 500,
                  fontSize: '1.1rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Basic responsive styles via injected style block to hide desktop nav on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
