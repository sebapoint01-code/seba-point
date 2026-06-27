import React, { useState, useEffect } from 'react';
import { Save, Image, Plus, Trash2, RefreshCw } from 'lucide-react';

function SliderLogoCMS({ token, onRefreshConfig }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [siteName, setSiteName] = useState('');
  const [logo, setLogo] = useState('');
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (response.ok && data) {
          setSiteName(data.siteName || '');
          setLogo(data.logo || '');
          setSlides(data.slides || []);
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

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }
      
      callback(data.url);
    } catch (err) {
      showNotification(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = (e) => {
    handleImageUpload(e, (base64) => {
      setSlides(prev => [...prev, base64]);
    });
  };

  const handleDeleteSlide = (indexToDelete) => {
    setSlides(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ siteName, logo, slides })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save configuration');
      
      showNotification('Identity & Hero Slider settings saved successfully!');
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
          {loading ? <RefreshCw size={18} className="spin-animation" /> : <><Save size={18} /><span>Save Slider & Logo Settings</span></>}
        </button>
      </form>
    </div>
  );
}

export default SliderLogoCMS;
