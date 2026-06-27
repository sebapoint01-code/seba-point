import React from 'react';
import { Phone, Mail, MapPin, Facebook, MessageCircle, ExternalLink, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';

function ContactPage({ settings }) {
  const address = settings?.contactAddress || 'NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh';
  const phone = settings?.contactPhone || '01813-884475';
  const email = settings?.contactEmail || 'sebapoint01@gmail.com';
  const facebookUrl = settings?.contactFacebook || 'https://www.facebook.com/sebapoint';
  const whatsappNumber = settings?.contactWhatsapp || '+880 1813-884475';
  const socialLinks = settings?.socialLinks || {};
  
  // Format whatsapp URL: remove spaces, pluses, dashes
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  const renderSocialIcon = (platform, url) => {
    if (!url) return null;
    const icons = {
      facebook: <Facebook size={24} />,
      instagram: <Instagram size={24} />,
      linkedin: <Linkedin size={24} />,
      youtube: <Youtube size={24} />,
      twitter: <Twitter size={24} />
    };
    return (
      <a 
        key={platform}
        href={url} 
        target="_blank" 
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '48px', height: '48px', borderRadius: '50%',
          backgroundColor: '#f0fdf4', color: '#16a34a',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#16a34a'; e.currentTarget.style.color = '#ffffff'; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
      >
        {icons[platform]}
      </a>
    );
  };

  return (
    <div className="contact-page" style={{ paddingTop: '5.5rem' }}>
      
      {/* Header Banner */}
      <section style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${settings?.contactBanner || '/contact_banner.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #cbd5e1'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: '#ffffff', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Contact {settings?.siteName || 'SebaPoint'}
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#f1f5f9', lineHeight: '1.6', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
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
            flexWrap: 'wrap',
            marginBottom: '3rem'
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
                fontWeight: 800,
                fontSize: '1.25rem',
                padding: '1rem 2rem',
                border: '2px solid #16a34a',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              className="facebook-link-hover"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Facebook size={26} fill="#16a34a" />
              <span>Facebook Page</span>
              <ExternalLink size={18} />
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
                fontWeight: 800,
                fontSize: '1.25rem',
                padding: '1rem 2rem',
                border: '2px solid #16a34a',
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              className="facebook-link-hover"
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <MessageCircle size={26} fill="#16a34a" color="#ffffff" style={{ strokeWidth: 1.5 }} />
              <span>Chat on WhatsApp</span>
              <ExternalLink size={18} />
            </a>
          </div>

          {/* Social Links Icons */}
          {Object.keys(socialLinks).length > 0 && (
            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Connect With Us</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                 {Object.entries(socialLinks).map(([platform, url]) => renderSocialIcon(platform, url))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

export default ContactPage;
