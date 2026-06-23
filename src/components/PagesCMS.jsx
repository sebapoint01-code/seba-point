import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

function PagesCMS({ token, onRefreshConfig }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Config States
  const [footerAddress, setFooterAddress] = useState('');
  const [footerPhone, setFooterPhone] = useState('');
  const [footerEmail, setFooterEmail] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactFacebook, setContactFacebook] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (response.ok && data) {
          setFooterAddress(data.footerAddress || '');
          setFooterPhone(data.footerPhone || '');
          setFooterEmail(data.footerEmail || '');
          setFacebookLink(data.socialLinks?.facebook || '');
          setAboutTitle(data.aboutTitle || '');
          setAboutContent(data.aboutContent || '');
          setContactAddress(data.contactAddress || '');
          setContactPhone(data.contactPhone || '');
          setContactEmail(data.contactEmail || '');
          setContactFacebook(data.contactFacebook || '');
          setContactWhatsapp(data.contactWhatsapp || '');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchConfig();
  }, []);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      window.scrollTo(0, 0);
    } else {
      setMessage(msg);
      window.scrollTo(0, 0);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const payload = {
      footerAddress,
      footerPhone,
      footerEmail,
      socialLinks: { facebook: facebookLink },
      aboutTitle,
      aboutContent,
      contactAddress,
      contactPhone,
      contactEmail,
      contactFacebook,
      contactWhatsapp
    };

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save configuration');
      
      showNotification('Footer & Page contents updated successfully!');
      if (onRefreshConfig) onRefreshConfig();
    } catch (err) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#16a34a', padding: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#ef4444', padding: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            Footer Configuration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>Office Address in Footer</label>
              <input type="text" className="form-control" value={footerAddress} onChange={(e) => setFooterAddress(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Phone Number</label>
                <input type="text" className="form-control" value={footerPhone} onChange={(e) => setFooterPhone(e.target.value)} required />
              </div>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Email Address</label>
                <input type="email" className="form-control" value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>Facebook Link</label>
              <input type="url" className="form-control" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://facebook.com/..." />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            About Us Page Customization
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>Mission & Story Heading</label>
              <input type="text" className="form-control" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>Page Body Content</label>
              <textarea rows="6" className="form-control" value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} style={{ resize: 'vertical' }} required />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            Contact Page Content
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>Support Desk Physical Address</label>
              <input type="text" className="form-control" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Broker Hotline Phone</label>
                <input type="text" className="form-control" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required />
              </div>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Hotline Email</label>
                <input type="email" className="form-control" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Facebook Link</label>
                <input type="url" className="form-control" value={contactFacebook} onChange={(e) => setContactFacebook(e.target.value)} required />
              </div>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>WhatsApp Hotline Number</label>
                <input type="text" className="form-control" value={contactWhatsapp} placeholder="+880 18XXXXXXXX" onChange={(e) => setContactWhatsapp(e.target.value)} required />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.85rem', width: '100%', justifyContent: 'center' }}>
          {loading ? <RefreshCw size={18} className="spin-animation" /> : <><Save size={18} /><span>Save All Page Content Changes</span></>}
        </button>
      </form>
    </div>
  );
}

export default PagesCMS;
