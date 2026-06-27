import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SERVICES_DATA } from '../servicesData';
import { 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  DollarSign, 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  Mail, 
  Award, 
  FileText, 
  UserCheck, 
  Copy,
  Check
} from 'lucide-react';

function ServiceDetailPage({ services, settings }) {
  const { id } = useParams();
  const [businessNature, setBusinessNature] = useState('sole');
  const [copied, setCopied] = useState(false);

  // Find the selected service dynamically
  const servicesList = services && services.length > 0 ? services : SERVICES_DATA;
  const service = servicesList.find(s => s.id === id);

  // Scroll to top when page mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Service not found</h2>
        <Link className="btn btn-primary" to="/home" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
          Return Home
        </Link>
      </div>
    );
  }

  // Dynamic template text generator based on service ID
  const getTemplateText = () => {
    let attachmentsText = '';
    if (businessNature === 'sole') {
      attachmentsText = '১. পাসপোর্ট সাইজ ছবি\n২. জাতীয় পরিচয়পত্র কপি';
    } else if (businessNature === 'partnership') {
      attachmentsText = '১. সকল অংশীদারের ছবি\n২. সকল অংশীদারের জাতীয় পরিচয়পত্র কপি\n৩. অংশীদারি চুক্তিপত্র (নন জুডিশিয়াল স্ট্যাম্প এ)';
    } else {
      attachmentsText = '১. মেমোরেন্ডাম/আর্টিকেল অফ এসোসিয়েশন এর কপি\n২. ইনকর্পোরেশন সার্টিফিকেট\n৩. ফর্ম XII';
    }

    const isTradeLicense = service.id === 'new-license' || service.id === 'renewal';
    const isCompanyReg = service.id === 'limited-company';

    let extraTop = '';
    if (isTradeLicense) {
      extraTop = `কর্পোরেশনের নাম- ঢাকা উত্তর/দক্ষিণ  সিটি কর্পোরেশন\nসিটি করপোরেশন এর ওয়ার্ড নাম্বারঃ \nব্যবসার ধরন- \n`;
    } else if (isCompanyReg) {
      extraTop = `শেয়ারহোল্ডারদের নাম ১: \nশেয়ারহোল্ডারদের নাম ২: \nশেয়ারহোল্ডারদের নাম ৩: \nঅনুমোদিত মূলধন (Authorized Capital): \nপরিশোধিত মূলধন (Paid-up Capital): \n`;
    }

    const bizNatureText = businessNature === 'sole' ? 'একক মালিকানা' : businessNature === 'partnership' ? 'অংশীদারি ব্যবসা' : 'লিমিটেড কোম্পানি';

    return `আবেদনকৃত সেবা: ${service.title}
----------------------------------------

${extraTop}প্রতিষ্ঠানের নাম: 
${isCompanyReg ? 'এমডি নাম: ' : 'মালিকের নাম: '}
পিতার নাম: 
মাতার নাম: 
বিজনেস প্রকৃতি: ${bizNatureText}

*স্থায়ী ঠিকানা:*  
হোল্ডিং নং- 
রোড- 
গ্রাম/মহল্লাঃ 
ডাকঘরঃ 
পোস্ট কোডঃ 
থানাঃ 
জেলাঃ 
বিভাগঃ 

*বর্তমান ঠিকানা:* 
হোল্ডিং নং- 
রোড- 
গ্রাম/মহল্লাঃ 
ডাকঘরঃ 
পোস্ট কোডঃ 
থানাঃ 
জেলাঃ 
বিভাগঃ 

বিজনেস ঠিকানা (Business Address): 

জাতীয় পরিচয়পত্র (NID) নম্বর: 
মোবাইল নম্বর: 
ইমেইল: 

প্রয়োজনীয় কাগজপত্র (Required Attachments):
${attachmentsText}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTemplateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="service-detail-page" style={{ paddingTop: '5.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Top navigation banner */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link 
            to="/home" 
            style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span>Home</span> / <span>Services</span> / <span style={{ color: '#16a34a', fontWeight: 600 }}>{service.title}</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Title Block */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, color: '#16a34a', display: 'block', marginBottom: '0.25rem' }}>
            Consultancy & Brokerage Service
          </span>
          <h1 style={{ fontSize: '2.5rem', color: '#0f172a', margin: '0 0 1rem 0', fontFamily: 'var(--font-display)', fontWeight: 850 }}>
            {service.title}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              Broker Fee: {service.brokerFee}
            </span>
            <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
              Govt Fee: {service.govtFee}
            </span>
            <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} /> Timeline: {service.timeline}
            </span>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="service-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Service Description & Dynamic Document Requirements */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Service Image Banner */}
            <div style={{
              width: '100%',
              height: '320px',
              background: 'radial-gradient(circle at center, #f1f5f9 0%, #e2e8f0 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 10px 25px -5px rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                boxShadow: '0 4px 10px rgba(22,163,74,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                ✓ Verified Partner
              </span>
              <img 
                src={service.image} 
                alt={service.title} 
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                }}
              />
            </div>

            {/* Service Overview */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Award size={20} style={{ color: '#16a34a' }} /> Service Overview
              </h3>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
                {service.fullDescription}
              </p>
            </div>

            {/* Interactive Requirements selector */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <FileText size={20} style={{ color: '#16a34a' }} /> প্রয়োজনীয় তথ্য ও সংযুক্তি (Requirements Checklist)
              </h3>
              
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                ব্যবসার প্রকৃতির ওপর ভিত্তি করে প্রয়োজনীয় তথ্য ও ডকুমেন্ট আলাদা হতে পারে। নিচের ট্যাব থেকে আপনার ব্যবসার ধরন সিলেক্ট করুন:
              </p>

              {/* Tab Selectors */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'sole', label: 'একক মালিকানা' },
                  { id: 'partnership', label: 'অংশীদারি ব্যবসা' },
                  { id: 'limited', label: 'লিমিটেড কোম্পানি' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setBusinessNature(tab.id)}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: businessNature === tab.id ? '#16a34a' : '#cbd5e1',
                      backgroundColor: businessNature === tab.id ? '#f0fdf4' : '#ffffff',
                      color: businessNature === tab.id ? '#166534' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Details & Documents checklist content based on Tab */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>১. যে তথ্যগুলো আপনার প্রয়োজন হবে (Information Fields):</strong>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {service.id === 'new-license' || service.id === 'renewal' ? (
                      <>
                        <li>• কর্পোরেশনের নাম (ঢাকা উত্তর/দক্ষিণ) ও ওয়ার্ড নাম্বার</li>
                        <li>• ব্যবসার ধরন ও প্রতিষ্ঠানের নাম</li>
                        <li>• মালিকের নাম, পিতার নাম ও মাতার নাম</li>
                      </>
                    ) : service.id === 'limited-company' ? (
                      <>
                        <li>• প্রস্তাবিত নাম ৩টি (RJSC RJSC Name Clearance এর জন্য)</li>
                        <li>• অনুমোদিত ও পরিশোধিত মূলধন পরিমাণ</li>
                        <li>• পরিচালকদের নাম ও পরিচিতি বিবরণী</li>
                      </>
                    ) : (
                      <>
                        <li>• প্রতিষ্ঠানের নাম ও ব্যবসার ধরন</li>
                        <li>• মালিকের নাম, পিতার নাম ও মাতার নাম</li>
                      </>
                    )}
                    <li>• মালিকের স্থায়ী ও বর্তমান ঠিকানা (হোল্ডিং নং, রোড, গ্রাম, ডাকঘর, থানা, জেলা)</li>
                    <li>• বিজনেস ঠিকানা, জাতীয় পরিচয়পত্র (NID) নম্বর, মোবাইল ও ইমেইল</li>
                  </ul>
                </div>

                <div>
                  <strong style={{ color: '#b91c1c', fontSize: '0.95rem', display: 'block', marginBottom: '0.4rem' }}>২. প্রয়োজনীয় ফাইলসমূহ (Required Files):</strong>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: '#b91c1c', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontWeight: 600 }}>
                    {businessNature === 'sole' && (
                      <>
                        <li>• মালিকের পাসপোর্ট সাইজ ছবি</li>
                        <li>• মালিকের জাতীয় পরিচয়পত্র (NID) এর পরিষ্কার কপি</li>
                      </>
                    )}
                    {businessNature === 'partnership' && (
                      <>
                        <li>• সকল অংশীদারের পাসপোর্ট সাইজ ছবি</li>
                        <li>• সকল অংশীদারের জাতীয় পরিচয়পত্র (NID) কপি</li>
                        <li>• অংশীদারি চুক্তিপত্র (৪০ পাতা নোটারী সহ)</li>
                      </>
                    )}
                    {businessNature === 'limited' && (
                      <>
                        <li>• চেয়ারম্যান ও ম্যানেজিং ডিরেক্টর এর ছবি এবং NID কপি</li>
                        <li>• মেমোরেন্ডাম অব অ্যাসোসিয়েশন (Memorandum)</li>
                        <li>• সার্টিফিকেট অব ইনকর্পোরেশন (Incorporation Certificate)</li>
                        <li>• ফরম XII (Form XII)</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}>
              <ShieldAlert size={22} style={{ color: '#d97706', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', marginBottom: '0.25rem' }}>Important Zoning Note</h4>
                <p style={{ fontSize: '0.85rem', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                  Zoning classification errors can cause trade license processing issues. Our team double-checks spatial boundaries with ward inspector logs to prevent filing delays.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Ordering Card & Pre-filled message block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '7.5rem' }}>
            
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              
              <span style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.75rem' }}>
                DIRECT MESSAGE TO ORDER
              </span>
              
              <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                How to Place Your Order
              </h3>
              
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                Copy the pre-formatted information block below, fill in the blanks, and message it to our consultants on WhatsApp, Messenger, or Email.
              </p>

              {/* Template Copy Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>Information Template:</span>
                  <button
                    onClick={handleCopy}
                    style={{
                      backgroundColor: copied ? '#15803d' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy Template'}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={getTemplateText()}
                  style={{
                    width: '100%',
                    height: '240px',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#334155',
                    resize: 'none',
                    lineHeight: '1.4'
                  }}
                />
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <a 
                  href={`https://wa.me/${settings?.contactWhatsapp?.replace(/[^0-9]/g, '') || '8801813884475'}?text=${encodeURIComponent(getTemplateText())}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    backgroundColor: '#25D366', 
                    color: 'white', 
                    padding: '0.9rem', 
                    borderRadius: '12px', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    fontWeight: 700, 
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.15)',
                    transition: 'all 0.2s'
                  }}
                >
                  <MessageCircle size={18} /> Send Order on WhatsApp
                </a>
                
                <a 
                  href={settings?.contactFacebook || 'https://facebook.com'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    backgroundColor: '#0084FF', 
                    color: 'white', 
                    padding: '0.9rem', 
                    borderRadius: '12px', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    fontWeight: 700, 
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(0, 132, 255, 0.15)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Send size={18} /> Message on Facebook
                </a>
                
                <a 
                  href={`mailto:${settings?.contactEmail || 'sebapoint01@gmail.com'}?subject=${encodeURIComponent('New Order: ' + service.title)}&body=${encodeURIComponent(getTemplateText())}`}
                  style={{ 
                    backgroundColor: '#0f172a', 
                    color: 'white', 
                    padding: '0.9rem', 
                    borderRadius: '12px', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    fontWeight: 700, 
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Mail size={18} /> Order via Email
                </a>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ServiceDetailPage;
