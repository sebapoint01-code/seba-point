import React, { useEffect } from 'react';
import { SERVICES_DATA } from '../servicesData';
import { ChevronLeft, CheckCircle, Clock, ShieldAlert, DollarSign, ArrowLeft } from 'lucide-react';

function ServiceDetailPage({ serviceId, onNavigate, services }) {
  // Find the selected service dynamically
  const servicesList = services && services.length > 0 ? services : SERVICES_DATA;
  const service = servicesList.find(s => s.id === serviceId);

  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2>Service not found</h2>
        <button className="btn btn-primary" onClick={() => onNavigate('homepage')}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="service-detail-page" style={{ paddingTop: '5.5rem' }}>
      
      {/* Breadcrumbs Banner */}
      <section style={{
        background: '#f8fafc',
        borderBottom: '1px solid var(--border-color)',
        padding: '1.5rem 2rem'
      }} className="no-print">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <a 
            href="#homepage" 
            onClick={(e) => { e.preventDefault(); onNavigate('homepage'); }}
            style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            Home
          </a>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: 'var(--text-muted)' }}>Services</span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>{service.title}</span>
        </div>
      </section>

      {/* Main Details Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <button 
          className="btn btn-secondary" 
          onClick={() => onNavigate('homepage')}
          style={{ marginBottom: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Services</span>
        </button>

        {/* Title Block */}
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: '#16a34a' }}>
            SebaPoint Consultancy
          </span>
          <h1 style={{ fontSize: '2.75rem', color: '#0f172a', margin: '0.25rem 0 1rem 0', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            {service.title}
          </h1>
          <div style={{ height: '3px', width: '80px', backgroundColor: '#16a34a', borderRadius: '2px' }}></div>
        </div>

        {/* Two-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Column: Description & Documents */}
          <div>
            {/* Image banner */}
            <div style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              marginBottom: '2.5rem'
            }}>
              <img 
                src={service.image} 
                alt={service.title} 
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              Service Overview
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
              {service.fullDescription}
            </p>

            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
              Required Checklist
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {service.documents.map((doc, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: '#1e293b' }}>
                  <CheckCircle size={20} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Fees, Timeline & Action Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'sticky', top: '7.5rem' }}>
            
            {/* Card details box */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
                Pricing & Timeline
              </h3>

              {/* Govt Fee */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <DollarSign size={20} style={{ color: '#16a34a', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Government Fees</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{service.govtFee}</div>
                </div>
              </div>

              {/* Processing Fee */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <DollarSign size={20} style={{ color: '#16a34a', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Processing Fees</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>{service.brokerFee}</div>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
                <Clock size={20} style={{ color: '#16a34a', marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Approximate Timeline</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>{service.timeline}</div>
                </div>
              </div>

              <button 
                className="btn" 
                onClick={() => onNavigate('contact')}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  boxShadow: '0 4px 10px 0 rgba(22, 163, 74, 0.2)',
                  fontSize: '1rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                <span>Inquire About Service</span>
              </button>
            </div>

            {/* Note box */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              <ShieldAlert size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                <strong>Broker Note:</strong> Zoning classification can restrict trade license validity. Our team inspects property locations beforehand to ensure holding numbers map correctly and prevent registration delays.
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ServiceDetailPage;
