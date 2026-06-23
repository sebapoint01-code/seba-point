import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Save, RefreshCw, Image, Settings, Edit, ShieldAlert, PlusCircle, Trash2 } from 'lucide-react';

function SeoCMS({ token, user, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [seo, setSeo] = useState({
    homepage: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
    about: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
    contact: { title: '', description: '', headers: [], subHeaders: [], plainText: '' }
  });
  const [selectedSeoPage, setSelectedSeoPage] = useState('homepage');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (response.ok && data) {
          const defaultSeo = {
            homepage: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
            about: { title: '', description: '', headers: [], subHeaders: [], plainText: '' },
            contact: { title: '', description: '', headers: [], subHeaders: [], plainText: '' }
          };
          setSeo({
            homepage: { ...defaultSeo.homepage, ...data.seo?.homepage },
            about: { ...defaultSeo.about, ...data.seo?.about },
            contact: { ...defaultSeo.contact, ...data.seo?.contact }
          });
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

  const handleSeoTextChange = (field, value) => {
    setSeo(prev => ({
      ...prev,
      [selectedSeoPage]: {
        ...prev[selectedSeoPage],
        [field]: value
      }
    }));
  };

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
        body: JSON.stringify({ seo })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save configuration');
      
      showNotification('SEO & page headers configuration updated successfully!');
    } catch (err) {
      showNotification(err.message, true);
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
                SEO Content & Headers CMS
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
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link 
            to="/admin-panel"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: 'white', color: '#475569', textDecoration: 'none',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Image size={18} />
            <span>Slider & Logo CMS</span>
          </Link>
          
          <Link 
            to="/admin-panel/pages"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: 'white', color: '#475569', textDecoration: 'none',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <Settings size={18} />
            <span>Footer & Pages CMS</span>
          </Link>

          <Link 
            to="/seo-headers-cms"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: '#16a34a', color: 'white', textDecoration: 'none',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
            }}
          >
            <FileText size={18} />
            <span>SEO & Headers CMS</span>
          </Link>

          <Link 
            to="/admin-panel/services"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px',
              backgroundColor: 'white', color: '#475569', textDecoration: 'none',
              fontWeight: 600, cursor: 'pointer', textAlign: 'left', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
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
              {loading ? <RefreshCw size={18} className="spin-animation" /> : <><Save size={18} /><span>Save All SEO metadata</span></>}
            </button>
          </form>

        </main>
      </div>
    </div>
  );
}

export default SeoCMS;
