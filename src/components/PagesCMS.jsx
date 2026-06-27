import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

function PagesCMS({ token, onRefreshConfig }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Config States
  const [footerAddress, setFooterAddress] = useState('');
  const [footerPhone, setFooterPhone] = useState('');
  const [footerEmail, setFooterEmail] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [aboutBanner, setAboutBanner] = useState('');
  
  const [contactAddress, setContactAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactFacebook, setContactFacebook] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactBanner, setContactBanner] = useState('');

  const [uploadingAboutBanner, setUploadingAboutBanner] = useState(false);
  const [uploadingContactBanner, setUploadingContactBanner] = useState(false);

  const aboutFileInput = useRef(null);
  const contactFileInput = useRef(null);

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
          setInstagramLink(data.socialLinks?.instagram || '');
          setLinkedinLink(data.socialLinks?.linkedin || '');
          setYoutubeLink(data.socialLinks?.youtube || '');
          setTwitterLink(data.socialLinks?.twitter || '');
          
          setAboutTitle(data.aboutTitle || '');
          setAboutContent(data.aboutContent || '');
          setAboutBanner(data.aboutBanner || '');

          setContactAddress(data.contactAddress || '');
          setContactPhone(data.contactPhone || '');
          setContactEmail(data.contactEmail || '');
          setContactFacebook(data.contactFacebook || '');
          setContactWhatsapp(data.contactWhatsapp || '');
          setContactBanner(data.contactBanner || '');
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

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      if (type === 'aboutBanner') setUploadingAboutBanner(true);
      if (type === 'contactBanner') setUploadingContactBanner(true);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      
      if (type === 'aboutBanner') setAboutBanner(data.fileUrl);
      if (type === 'contactBanner') setContactBanner(data.fileUrl);

      showNotification('Banner uploaded successfully!');
    } catch (err) {
      showNotification(err.message, true);
    } finally {
      if (type === 'aboutBanner') setUploadingAboutBanner(false);
      if (type === 'contactBanner') setUploadingContactBanner(false);
      if (e.target) e.target.value = null; // reset input
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
      socialLinks: { 
        facebook: facebookLink,
        instagram: instagramLink,
        linkedin: linkedinLink,
        youtube: youtubeLink,
        twitter: twitterLink
      },
      aboutTitle,
      aboutContent,
      aboutBanner,
      contactAddress,
      contactPhone,
      contactEmail,
      contactFacebook,
      contactWhatsapp,
      contactBanner
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
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Facebook Link</label>
                <input type="url" className="form-control" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://facebook.com/..." />
              </div>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>Instagram Link</label>
                <input type="url" className="form-control" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder="https://instagram.com/..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>LinkedIn Link</label>
                <input type="url" className="form-control" value={linkedinLink} onChange={(e) => setLinkedinLink(e.target.value)} placeholder="https://linkedin.com/..." />
              </div>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, color: '#475569' }}>YouTube Link</label>
                <input type="url" className="form-control" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>Twitter / X Link</label>
              <input type="url" className="form-control" value={twitterLink} onChange={(e) => setTwitterLink(e.target.value)} placeholder="https://twitter.com/..." />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            About Us Page Customization
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontWeight: 600, color: '#475569' }}>About Us Banner Image</label>
              {aboutBanner && (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={aboutBanner} alt="About Banner Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={aboutFileInput} onChange={(e) => handleFileUpload(e, 'aboutBanner')} />
              <button type="button" onClick={() => aboutFileInput.current.click()} disabled={uploadingAboutBanner} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, alignSelf: 'flex-start' }}>
                {uploadingAboutBanner ? <RefreshCw size={18} className="spin-animation" /> : <Upload size={18} />}
                <span>{uploadingAboutBanner ? 'Uploading...' : 'Upload New About Banner'}</span>
              </button>
            </div>
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
              <label style={{ fontWeight: 600, color: '#475569' }}>Contact Page Banner Image</label>
              {contactBanner && (
                <div style={{ marginBottom: '1rem' }}>
                  <img src={contactBanner} alt="Contact Banner Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={contactFileInput} onChange={(e) => handleFileUpload(e, 'contactBanner')} />
              <button type="button" onClick={() => contactFileInput.current.click()} disabled={uploadingContactBanner} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, alignSelf: 'flex-start' }}>
                {uploadingContactBanner ? <RefreshCw size={18} className="spin-animation" /> : <Upload size={18} />}
                <span>{uploadingContactBanner ? 'Uploading...' : 'Upload New Contact Banner'}</span>
              </button>
            </div>
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
