import React, { useState, useEffect } from 'react';
import { Settings, Image, Edit, FileText, Plus, Power, Trash2, Eye, EyeOff, Save, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';

function AdminPanel({ token, user, onNavigate, onLogout, initialConfig, initialServices, onRefreshConfig, onRefreshServices }) {
  const [activeTab, setActiveTab] = useState('site'); // 'site', 'pages', 'seo', 'services'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Logo & Slider State
  const [siteName, setSiteName] = useState('');
  const [logo, setLogo] = useState('');
  const [slides, setSlides] = useState([]);

  // 2. Footer & Page Content State
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

  // 3. SEO Content State (Homepage, About, Contact)
  const [seo, setSeo] = useState({
    homepage: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
    about: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
    contact: { title: '', description: '', headers: [], subHeaders: [], plainText: '' }
  });
  const [selectedSeoPage, setSelectedSeoPage] = useState('homepage');

  // 4. Services Grid CRUD State
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null); // service object if editing, or empty object for new
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Load configuration details from initialConfig
  useEffect(() => {
    if (initialConfig) {
      setSiteName(initialConfig.siteName || '');
      setLogo(initialConfig.logo || '');
      setSlides(initialConfig.slides || []);
      setFooterAddress(initialConfig.footerAddress || '');
      setFooterPhone(initialConfig.footerPhone || '');
      setFooterEmail(initialConfig.footerEmail || '');
      setFacebookLink(initialConfig.socialLinks?.facebook || '');
      setAboutTitle(initialConfig.aboutTitle || '');
      setAboutContent(initialConfig.aboutContent || '');
      setContactAddress(initialConfig.contactAddress || '');
      setContactPhone(initialConfig.contactPhone || '');
      setContactEmail(initialConfig.contactEmail || '');
      setContactFacebook(initialConfig.contactFacebook || '');
      setContactWhatsapp(initialConfig.contactWhatsapp || '');
      
      // Load SEO content safely
      const defaultSeo = {
        homepage: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
        about: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
        contact: { title: '', description: '', headers: [], subHeaders: [], plainText: '' }
      };
      setSeo({
        homepage: { ...defaultSeo.homepage, ...initialConfig.seo?.homepage },
        about: { ...defaultSeo.about, ...initialConfig.seo?.about },
        contact: { ...defaultSeo.contact, ...initialConfig.seo?.contact }
      });
    }
  }, [initialConfig]);

  // Load services
  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
    }
  }, [initialServices]);

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

  // Convert image file to Base64 string
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Add Slider Image
  const handleAddSlide = (e) => {
    handleImageUpload(e, (base64) => {
      setSlides(prev => [...prev, base64]);
    });
  };

  // Delete Slider Image
  const handleDeleteSlide = (indexToDelete) => {
    setSlides(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // Save Settings to Backend
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const payload = {
      siteName,
      logo,
      slides,
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
      contactWhatsapp,
      seo
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
      
      showNotification('Website configuration updated successfully!');
      onRefreshConfig(); // reload settings globally in App.jsx
    } catch (err) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // SEO Text Input handler
  const handleSeoTextChange = (field, value) => {
    setSeo(prev => ({
      ...prev,
      [selectedSeoPage]: {
        ...prev[selectedSeoPage],
        [field]: value
      }
    }));
  };

  // SEO Headers Handler (Manage lists)
  const handleSeoHeaderChange = (index, value, listName = 'headers') => {
    const updatedList = [...seo[selectedSeoPage][listName]];
    updatedList[index] = value;
    setSeo(prev => ({
      ...prev,
      [selectedSeoPage]: {
        ...prev[selectedSeoPage],
        [listName]: updatedList
      }
    }));
  };

  const handleAddSeoHeader = (listName = 'headers') => {
    setSeo(prev => ({
      ...prev,
      [selectedSeoPage]: {
        ...prev[selectedSeoPage],
        [listName]: [...prev[selectedSeoPage][listName], '']
      }
    }));
  };

  const handleRemoveSeoHeader = (index, listName = 'headers') => {
    setSeo(prev => ({
      ...prev,
      [selectedSeoPage]: {
        ...prev[selectedSeoPage],
        [listName]: prev[selectedSeoPage][listName].filter((_, idx) => idx !== index)
      }
    }));
  };

  // CRUD: Toggle Pause Service Card
  const handleTogglePause = async (id, currentPauseState) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPaused: !currentPauseState })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to toggle status');

      showNotification(`Service status updated!`);
      onRefreshServices(); // Reload services
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // CRUD: Delete Service Card
  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service card completely?")) return;
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete service');

      showNotification('Service card deleted successfully!');
      onRefreshServices();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // CRUD: Save/Create/Edit Service Card Form
  const handleOpenServiceForm = (service = null) => {
    if (service) {
      setEditingService({ ...service });
    } else {
      setEditingService({
        title: '',
        shortDescription: '',
        fullDescription: '',
        image: '',
        govtFee: '',
        brokerFee: '',
        timeline: '',
        documents: ['']
      });
    }
    setShowServiceForm(true);
  };

  const handleServiceFormChange = (field, value) => {
    setEditingService(prev => ({ ...prev, [field]: value }));
  };

  const handleDocCheckboxChange = (index, value) => {
    const docs = [...editingService.documents];
    docs[index] = value;
    setEditingService(prev => ({ ...prev, documents: docs }));
  };

  const handleAddDocItem = () => {
    setEditingService(prev => ({ ...prev, documents: [...prev.documents, ''] }));
  };

  const handleRemoveDocItem = (index) => {
    setEditingService(prev => ({ ...prev, documents: prev.documents.filter((_, idx) => idx !== index) }));
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean up empty document lines
    const documents = editingService.documents.filter(d => d.trim() !== '');
    const payload = { ...editingService, documents };

    const isEdit = !!editingService._id;
    const url = isEdit ? `/api/services/${editingService.id}` : '/api/services';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save service card');

      showNotification(`Service card ${isEdit ? 'updated' : 'created'} successfully!`);
      setShowServiceForm(false);
      setEditingService(null);
      onRefreshServices();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <button 
              className="btn btn-secondary" 
              onClick={() => onNavigate('homepage')}
              style={{ backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155' }}
            >
              <span>View Public Site</span>
            </button>
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
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('site')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: activeTab === 'site' ? '#16a34a' : 'white', color: activeTab === 'site' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Image size={18} />
            <span>Slider & Logo CMS</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('pages')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: activeTab === 'pages' ? '#16a34a' : 'white', color: activeTab === 'pages' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Settings size={18} />
            <span>Footer & Pages CMS</span>
          </button>

          <button 
            onClick={() => setActiveTab('seo')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: activeTab === 'seo' ? '#16a34a' : 'white', color: activeTab === 'seo' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <FileText size={18} />
            <span>SEO & Headers CMS</span>
          </button>

          <button 
            onClick={() => setActiveTab('services')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: activeTab === 'services' ? '#16a34a' : 'white', color: activeTab === 'services' ? 'white' : '#475569',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Edit size={18} />
            <span>Service Cards CRUD</span>
          </button>

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
            <h4 style={{ fontSize: '0.85rem', color: '#881337', marginBottom: '0.5rem' }}>Owner Dashboard Access</h4>
            <p style={{ fontSize: '0.75rem', color: '#9f1239', lineHeight: '1.4', marginBottom: '1rem' }}>
              Are you the business owner? Log in to view Billing, Stats, and Employee controls.
            </p>
            <button 
              onClick={() => onNavigate('owner-login')}
              style={{
                width: '100%', padding: '0.5rem', backgroundColor: '#f43f5e', color: 'white',
                border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Go to Owner Login
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

          {/* TAB 1: SITE LOGO & SLIDER */}
          {activeTab === 'site' && (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                  Site Identity & Branding
                </h3>
                
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, color: '#475569' }}>Website Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600, color: '#475569' }}>Brand Logo</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {logo && (
                        <div style={{ padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                          <img src={logo} alt="Preview" style={{ height: '45px', objectFit: 'contain' }} />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setLogo)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  Hero Slideshow Images
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Upload high-quality images to render dynamically inside the homepage sliding hero banner. Recommendation: 1920x1080px size.
                </p>

                {/* Slides Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {slides.map((slide, index) => (
                    <div key={index} style={{ position: 'relative', height: '120px', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <img src={slide} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={() => handleDeleteSlide(index)}
                        style={{
                          position: 'absolute', top: '8px', right: '8px', backgroundColor: '#ef4444', color: 'white',
                          border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Placeholder */}
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    height: '120px', border: '2px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer',
                    color: '#64748b', transition: 'all 0.2s', backgroundColor: '#f8fafc'
                  }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#16a34a'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}>
                    <Plus size={24} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Add Slide Image</span>
                    <input type="file" accept="image/*" onChange={handleAddSlide} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <button type="submit" className="btn" disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.85rem', width: '100%', justifyContent: 'center' }}>
                <Save size={18} />
                <span>Save All Website Settings</span>
              </button>
            </form>
          )}

          {/* TAB 2: FOOTER & PAGES CMS */}
          {activeTab === 'pages' && (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                <Save size={18} />
                <span>Save All Page Content Changes</span>
              </button>
            </form>
          )}

          {/* TAB 3: SEO CONTENT MANAGEMENT */}
          {activeTab === 'seo' && (
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  SEO Content & Metadata
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Manage metadata titles, descriptions, headers, and plain-text contents for each of the public pages.
                </p>

                {/* Sub-selector for Page */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  {['homepage', 'about', 'contact'].map((p) => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => setSelectedSeoPage(p)}
                      style={{
                        padding: '0.5rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer',
                        backgroundColor: selectedSeoPage === p ? '#16a34a' : 'white', color: selectedSeoPage === p ? 'white' : '#475569',
                        fontWeight: 600, textTransform: 'capitalize'
                      }}
                    >
                      {p === 'homepage' ? 'Home Page' : `${p} Page`}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>SEO Page Title Tag</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={seo[selectedSeoPage]?.title || ''} 
                        onChange={(e) => handleSeoTextChange('title', e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>SEO Meta Description</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={seo[selectedSeoPage]?.description || ''} 
                        onChange={(e) => handleSeoTextChange('description', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: 600, color: '#475569' }}>Plain Text SEO Paragraph</label>
                    <textarea 
                      rows="4" 
                      className="form-control" 
                      value={seo[selectedSeoPage]?.plainText || ''} 
                      onChange={(e) => handleSeoTextChange('plainText', e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Header list management */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Dynamic Page Headers (h1/h2 tags)</label>
                      <button 
                        type="button" 
                        onClick={() => handleAddSeoHeader('headers')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        <PlusCircle size={14} /> Add Header
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(seo[selectedSeoPage]?.headers || []).map((header, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={header} 
                            onChange={(e) => handleSeoHeaderChange(idx, e.target.value, 'headers')} 
                            required 
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSeoHeader(idx, 'headers')}
                            style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub Header list management */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Dynamic Page Sub-Headers (h3/h4/badges)</label>
                      <button 
                        type="button" 
                        onClick={() => handleAddSeoHeader('subHeaders')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        <PlusCircle size={14} /> Add Subheader
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(seo[selectedSeoPage]?.subHeaders || []).map((subh, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={subh} 
                            onChange={(e) => handleSeoHeaderChange(idx, e.target.value, 'subHeaders')} 
                            required 
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSeoHeader(idx, 'subHeaders')}
                            style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <button type="submit" className="btn" disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.85rem', width: '100%', justifyContent: 'center' }}>
                <Save size={18} />
                <span>Save All SEO metadata</span>
              </button>
            </form>
          )}

          {/* TAB 4: SERVICES CARDS CRUD */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: 0 }}>
                  Service Card Configurations
                </h3>
                {!showServiceForm && (
                  <button 
                    onClick={() => handleOpenServiceForm()} 
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#16a34a', color: 'white',
                      border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} /> Add Service Card
                  </button>
                )}
              </div>

              {showServiceForm && editingService ? (
                /* Service CRUD Form */
                <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: 0, color: '#334155' }}>
                      {editingService._id ? 'Edit Service Details' : 'Create New Service Card'}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Service Title *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingService.title} 
                        onChange={(e) => handleServiceFormChange('title', e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Govt Fees *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingService.govtFee} 
                        onChange={(e) => handleServiceFormChange('govtFee', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Broker Processing Fee *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingService.brokerFee} 
                        onChange={(e) => handleServiceFormChange('brokerFee', e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Timeline *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingService.timeline} 
                        onChange={(e) => handleServiceFormChange('timeline', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 2, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Service Image (Card Thumbnail)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, (b64) => handleServiceFormChange('image', b64))} 
                        style={{ fontSize: '0.85rem' }} 
                      />
                    </div>
                    {editingService.image && (
                      <div style={{ width: '80px', height: '80px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.25rem', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={editingService.image} alt="Thumbnail" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: 600, color: '#475569' }}>Card Short Description (Max 120 chars) *</label>
                    <input 
                      type="text" 
                      maxLength="120"
                      className="form-control" 
                      value={editingService.shortDescription} 
                      onChange={(e) => handleServiceFormChange('shortDescription', e.target.value)} 
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: 600, color: '#475569' }}>Service Full Overview *</label>
                    <textarea 
                      rows="4" 
                      className="form-control" 
                      value={editingService.fullDescription} 
                      onChange={(e) => handleServiceFormChange('fullDescription', e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Documents checklist */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontWeight: 600, color: '#475569' }}>Required Checklist Documents</label>
                      <button 
                        type="button" 
                        onClick={handleAddDocItem}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        <PlusCircle size={14} /> Add Doc Item
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {editingService.documents.map((doc, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={doc} 
                            onChange={(e) => handleDocCheckboxChange(idx, e.target.value)} 
                            placeholder="e.g. NID owner copy"
                            required 
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveDocItem(idx)}
                            style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => { setShowServiceForm(false); setEditingService(null); }}
                      style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn"
                      style={{ backgroundColor: '#16a34a', color: 'white', flex: 2, padding: '0.75rem', justifyContent: 'center' }}
                    >
                      <Save size={16} />
                      <span>Save Service Card</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Service List Table */
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>Image</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>Title</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>Fees (Govt/Broker)</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600 }}>Timeline</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '0.75rem 1rem', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service._id} style={{ borderBottom: '1px solid #f1f5f9', opacity: service.isPaused ? 0.6 : 1 }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ width: '50px', height: '50px', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={service.image} alt={service.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>
                            {service.title}
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                            <div>Govt: {service.govtFee}</div>
                            <div style={{ color: '#16a34a', fontWeight: 600 }}>Broker: {service.brokerFee}</div>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                            {service.timeline}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{
                              padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                              backgroundColor: service.isPaused ? '#fee2e2' : '#dcfce7',
                              color: service.isPaused ? '#ef4444' : '#16a34a'
                            }}>
                              {service.isPaused ? 'Paused' : 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleTogglePause(service.id, service.isPaused)}
                                title={service.isPaused ? "Resume Card" : "Pause Card"}
                                style={{
                                  backgroundColor: service.isPaused ? '#dcfce7' : '#fee2e2',
                                  color: service.isPaused ? '#16a34a' : '#ef4444',
                                  border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer'
                                }}
                              >
                                {service.isPaused ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button 
                                onClick={() => handleOpenServiceForm(service)}
                                title="Edit Service Card"
                                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteService(service.id)}
                                title="Delete Card"
                                style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default AdminPanel;
