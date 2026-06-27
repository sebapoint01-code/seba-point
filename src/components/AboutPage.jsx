import React from 'react';
import { ShieldAlert, Award, Milestone, Users } from 'lucide-react';

function AboutPage({ settings }) {
  const title = settings?.aboutTitle || 'Our Mission & Story';
  const content = settings?.aboutContent || 'Starting a business in Bangladesh should be exciting, not bogged down by weeks of standing in bank queues, tracking holding utility bills, or coordinating inspector visits. SebaPoint was founded with a clear mission: to act as a reliable, fully transparent brokerage point connecting business owners directly to City Corporation offices.\n\nWe act as a licensed broker to prepare application filings, submit official challan bank deposits, and facilitate property inspector inspections. By carrying out the administrative legwork, we enable local shop owners, importers, exporters, and Limited Companies to get back to what matters most—scaling their operations.';

  const paragraphs = content.split('\n\n');

  return (
    <div className="about-page" style={{ paddingTop: '5.5rem' }}>
      
      {/* Header Banner */}
      <section style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${settings?.aboutBanner || '/about_banner.png'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #cbd5e1'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: '#ffffff', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            About {settings?.siteName || 'SebaPoint'}
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#f1f5f9', lineHeight: '1.6', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Learn more about Dhaka's premier trade license brokerage and corporate registration hub.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <blockquote style={{
            borderLeft: '4px solid #ef4444',
            paddingLeft: '1rem',
            fontStyle: 'italic',
            fontSize: '1.15rem',
            color: '#15803d',
            marginBottom: '1.5rem',
            fontWeight: 500
          }}>
            "Our main purpose is to provide you with the best service."
          </blockquote>
          {paragraphs.map((p, idx) => (
            <p key={idx} style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              {p}
            </p>
          ))}
        </div>

        {/* Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '3.5rem'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)'
          }}>
            <Award size={36} style={{ color: '#16a34a', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Professional Expertise</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              We possess years of experience mapping correct business classifications, zoning requirements, and holding tax regulations.
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)'
          }}>
            <Users size={36} style={{ color: '#16a34a', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Client Centric</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Your documentation safety is our priority. We collect original papers securely and deliver licenses directly to your office.
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)'
          }}>
            <Milestone size={36} style={{ color: '#16a34a', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Transparent Fees</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              No hidden broker markups. We provide official bank challan receipts for all government license fees and charge a flat processing cost.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}

export default AboutPage;
