import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_DATA } from '../servicesData';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    question: 'How long does it take to get a Trade License with Seba Point?',
    answer: 'We deliver all types of licenses in just 3 days! Our fast-track processing coordinates directly with City Corporation officers to ensure swift delivery.'
  },
  {
    question: 'What documents do I need for a new Trade License?',
    answer: 'Typically, you need a copy of your National ID (NID), 3 recent passport-sized photos, a rental agreement of your commercial space, and a holding tax receipt from the landlord.'
  },
  {
    question: 'Do you handle Dhaka North City Corporation (DNCC) licenses?',
    answer: 'Yes! We specialize in processing licenses across Dhaka North and Dhaka South City Corporations. We manage everything including fee calculation, bank challans, and inspector visits.'
  },
  {
    question: 'Where is the Seba Point office located?',
    answer: 'Our main office is located at NE3, House-16, Road-10, Gulshan-1, Dhaka-1212, Bangladesh. You can also reach us via phone at 01813-884475 or email at sebapoint01@gmail.com.'
  }
];

function Homepage({ settings, services }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const SLIDES = settings?.slides && settings.slides.length > 0 ? settings.slides : [
    '/slide1.png',
    '/slide2.png',
    '/slide3.png'
  ];

  const servicesList = services && services.length > 0 ? services.filter(s => !s.isPaused) : SERVICES_DATA;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const toggleFaq = (index) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  const seoData = settings?.seo?.homepage;
  const badges = seoData?.subHeaders && seoData.subHeaders.length > 0 ? seoData.subHeaders : ['৩ দিনে আপনার সব ধরনের লাইসেন্স রেডি!'];
  const title = seoData?.headers?.[0] || 'Get Your Trade License Ready in 3 Days!';
  const subtitle = seoData?.headers?.[1] || 'YOUR ONE STOP SERVICE HUB';
  const description = seoData?.plainText || '"Our main purpose is to provide you with the best service." We handle new trade license registrations, renewals, NBR VAT (BIN) certificates, and company filings directly with government offices.';

  return (
    <div className="homepage-section">
      
      {/* Hero Banner with Slider */}
      <section className="landing-hero" style={{
        position: 'relative',
        padding: '10rem 2rem 8rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #86efac',
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Slider */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          overflow: 'hidden'
        }}>
          {SLIDES.map((slide, index) => (
            <img 
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                zIndex: 0
              }} 
            />
          ))}
          {/* Light Overlay to ensure text readability */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            zIndex: 1
          }} />
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#14532d',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '1px solid #86efac'
            }}>
              {subtitle}
            </span>
            {badges.map((badge, idx) => (
              <span key={idx} style={{
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '1px solid #fca5a5'
              }}>
                {badge}
              </span>
            ))}
          </div>
          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: 1.15,
            fontWeight: 850,
            fontFamily: 'var(--font-display)',
            color: '#0f172a',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            {title.includes('3 Days') ? (
              <>
                {title.split('3 Days')[0]}
                <span style={{ color: '#ef4444' }}>3 Days!</span>
              </>
            ) : title}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#475569',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            {description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn" 
              onClick={() => {
                const el = document.getElementById('services-grid-title');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                fontSize: '1.05rem',
                boxShadow: '0 4px 14px 0 rgba(22, 163, 74, 0.3)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              <span>Explore Services</span>
            </button>
            <Link 
              className="btn btn-secondary" 
              to="/contact"
              style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              <span>Talk to Broker</span>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Bubbles */}
        <div className="hero-bubble" style={{ top: '15%', left: '8%' }}></div>
        <div className="hero-bubble" style={{ bottom: '20%', right: '10%' }}></div>
      </section>

      {/* Services Grid Section */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div id="services-grid-title" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
            Our Professional Services
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Select a card to view detailed government fees, document checklists, and timelines on a separate details page.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {servicesList.map((service) => (
            <Link 
              key={service.id} 
              to={`/product/${service.id}`}
              className="service-card"
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(22,163,74,0.15), 0 10px 15px -5px rgba(22,163,74,0.1)';
                e.currentTarget.style.borderColor = '#86efac';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Card Image Block */}
              <div className="card-image-box" style={{
                height: '220px',
                width: '100%',
                background: 'radial-gradient(circle at center, #f1f5f9 0%, #e2e8f0 100%)',
                borderBottom: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative'
              }}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  className="card-img-element"
                />
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 10px rgba(22,163,74,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  ✓ Verified
                </span>
              </div>

              {/* Card Content Block */}
              <div style={{ padding: '1.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', fontWeight: 850 }}>
                  {service.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem' }}>
                  {service.shortDescription}
                </p>

                {/* Pricing Grid */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #dcfce7'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#15803d', display: 'block', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>Broker Fee</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a', fontFamily: 'var(--font-display)' }}>
                      {service.brokerFee}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', borderLeft: '1px solid #bbf7d0', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#475569', display: 'block', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.2rem' }}>Govt Fee</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>
                      {service.govtFee}
                    </span>
                  </div>
                </div>

                {/* CTA Action Bar */}
                <div style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                }} className="card-cta-btn">
                  <span>View Details & Order</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #dcfce7' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Everything you need to know about our brokerage services.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #dcfce7',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#0f172a',
                    fontWeight: 600,
                    fontSize: '1.05rem'
                  }}
                >
                  {faq.question}
                  {openFaqIndex === index ? (
                    <ChevronUp size={20} color="#16a34a" />
                  ) : (
                    <ChevronDown size={20} color="#64748b" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    color: '#475569',
                    lineHeight: '1.6',
                    fontSize: '0.95rem'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Homepage;
