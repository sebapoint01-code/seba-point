import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Mail, MapPin, Phone } from 'lucide-react';

function Footer({ settings }) {
  const siteLogo = settings?.logo || '/logo.png';
  const siteName = settings?.siteName || 'SebaPoint';
  const address = settings?.footerAddress || 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh.';
  const phone = settings?.footerPhone || '01813-884475';
  const email = settings?.footerEmail || 'sebapoint01@gmail.com';
  
  const socialLinks = settings?.socialLinks || { facebook: 'https://www.facebook.com/sebapoint' };

  const quickLinks = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contacts' }
  ];

  const renderSocialIcon = (platform, url) => {
    if (!url) return null;
    
    const icons = {
      facebook: <Facebook size={18} />,
      instagram: <Instagram size={18} />,
      linkedin: <Linkedin size={18} />,
      youtube: <Youtube size={18} />,
      twitter: <Twitter size={18} />
    };
    
    return (
      <a 
        key={platform}
        href={url} 
        target="_blank" 
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)', color: 'white',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#16a34a'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
      >
        {icons[platform]}
      </a>
    );
  };

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      borderTop: '4px solid #16a34a',
      fontSize: '0.9rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }} className="no-print">
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem'
      }}>
        
        {/* Column 1: Brand Info */}
        <div>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <img 
              src={siteLogo} 
              alt={siteName} 
              style={{ height: '40px', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)' }}>
              {siteName}
            </span>
          </div>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Your One Stop Service Hub. We specialize in Trade Licenses, Company Registration, and Digital Business Solutions in Bangladesh.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
             {Object.entries(socialLinks).map(([platform, url]) => renderSocialIcon(platform, url))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseOver={(e) => e.target.style.color = '#16a34a'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h3 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Contact Us</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#cbd5e1' }}>
              <MapPin size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ lineHeight: '1.5' }}>{address}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
              <Phone size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>{phone}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
              <Mail size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span>{email}</span>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Copyright Bar */}
      <div style={{ backgroundColor: '#020617', padding: '1.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#475569', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
