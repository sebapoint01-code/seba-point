import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, PlusCircle, RefreshCw } from 'lucide-react';

function ServicesCMS({ token }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setServices(data);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
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

      showNotification(`Service card status updated!`);
      fetchServices();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

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
      fetchServices();
    } catch (err) {
      showNotification(err.message, true);
    }
  };

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
      fetchServices();
    } catch (err) {
      alert(err.message);
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
              disabled={loading}
              style={{ backgroundColor: '#16a34a', color: 'white', flex: 2, padding: '0.75rem', justifyContent: 'center' }}
            >
              {loading ? <RefreshCw size={16} className="spin-animation" /> : <><Save size={16} /><span>Save Service Card</span></>}
            </button>
          </div>
        </form>
      ) : (
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
  );
}

export default ServicesCMS;
