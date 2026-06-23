import React from 'react';
import { Phone, Mail, MapPin, Facebook, MessageCircle, ExternalLink } from 'lucide-react';

function ContactPage({ settings }) {
  const address = settings?.contactAddress || 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh';
  const phone = settings?.contactPhone || '01813-884475';
  const email = settings?.contactEmail || 'sebapoint01@gmail.com';
  const facebookUrl = settings?.contactFacebook || 'https://www.facebook.com/sebapoint';
  const whatsappNumber = settings?.contactWhatsapp || '+880 1813-884475';
  
  // Format whatsapp URL: remove spaces, pluses, dashes
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="contact-page" style={{ paddingTop: '5.5rem' }}>
      
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #fed7aa'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: '#0f172a', marginBottom: '1rem' }}>
            Contact SebaPoint
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: '1.6' }}>
            Get in touch with our document processing desk for swift trade license solutions.
          </p>
        </div>
      </section>

      {/* Polish Center Container */}
      <section style={{ padding: '5rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
            Office & Support Desk
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '3rem', fontSize: '1.05rem' }}>
            Our support desk handles Zoning applications, NBR BIN (VAT) registrations, holding taxes, and corporate filings. You can call us, email us, or visit our desk in Dhaka.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Call Support</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '0.2rem' }}>{phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '0.2rem', wordBreak: 'break-all' }}>{email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', gridColumn: 'span 2' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Office Address</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '0.2rem', lineHeight: '1.5' }}>{address}</div>
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#16a34a',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.75rem 1.5rem',
                border: '1px solid #16a34a',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              className="facebook-link-hover"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Facebook size={22} fill="#16a34a" />
              <span>Facebook Page</span>
              <ExternalLink size={14} />
            </a>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#16a34a',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.75rem 1.5rem',
                border: '1px solid #16a34a',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              className="facebook-link-hover"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <MessageCircle size={22} fill="#16a34a" color="#ffffff" style={{ strokeWidth: 1.5 }} />
              <span>Chat on WhatsApp</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ContactPage;
