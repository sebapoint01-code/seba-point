import React, { useState, useEffect, useRef } from 'react';
import { Download, Printer } from 'lucide-react';

function InvoicePreview({ invoiceData }) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const availableWidth = containerWidth - 32;
        const newScale = Math.min(availableWidth / 794, 1);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Custom high-fidelity currency formatter
  const formatCurrency = (amount) => {
    const currency = invoiceData.currency || 'USD';
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const formattedVal = formatter.format(amount);
    
    switch (currency) {
      case 'BDT':
        return `৳${formattedVal}`;
      case 'INR':
        return `₹${formattedVal}`;
      case 'USD':
        return `$${formattedVal}`;
      case 'EUR':
        return `€${formattedVal}`;
      case 'GBP':
        return `£${formattedVal}`;
      default:
        return `${currency} ${formattedVal}`;
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Keep date exact without timezone shifts
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Dynamic Styles based on Accent Color (defaults to #16a34a green)
  const accentColor = invoiceData.accentColor || '#16a34a';

  // Trigger A4 high-fidelity PDF download with dynamic loader fallback
  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-preview-capture');
    if (!element) return;

    const runPDFGeneration = () => {
      const opt = {
        margin:       [0, 0, 0, 0], // Margins handled inside container for precise pixel replication
        filename:     `Invoice_${invoiceData?.invoiceNumber || 'Draft'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      window.html2pdf().set(opt).from(element).save();
    };

    if (window.html2pdf) {
      runPDFGeneration();
    } else {
      // Create a local dynamic loader script
      const localScript = document.createElement('script');
      localScript.src = '/html2pdf.bundle.min.js';
      localScript.onload = () => {
        if (window.html2pdf) {
          runPDFGeneration();
        } else {
          // If local fails to define html2pdf, try the CDN fallback
          loadCDNFallback(runPDFGeneration);
        }
      };
      localScript.onerror = () => {
        loadCDNFallback(runPDFGeneration);
      };
      document.body.appendChild(localScript);
    }
  };

  const loadCDNFallback = (onSuccess) => {
    const cdnScript = document.createElement('script');
    cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    cdnScript.onload = () => {
      if (window.html2pdf) {
        onSuccess();
      } else {
        alert('Could not initialize the PDF engine. Please use the Print option as a fallback.');
      }
    };
    cdnScript.onerror = () => {
      alert('Failed to load PDF generation engine. Please check your internet connection or use the browser Print option.');
    };
    document.body.appendChild(cdnScript);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatFooterDate = () => {
    const now = new Date();
    const options = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleString('en-US', options);
  };

  return (
    <div style={{ 
      position: 'sticky', 
      top: '1.5rem', 
      maxHeight: 'calc(100vh - 4.5rem)', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      
      {/* Action Bar */}
      <div className="no-print" style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '0.75rem'
      }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handlePrint}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
        >
          <Printer size={15} />
          <span>Print</span>
        </button>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={handleDownloadPDF}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, backgroundColor: accentColor, border: `1px solid ${accentColor}` }}
        >
          <Download size={15} />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Styled A4 Sheet View wrapper with responsive container scaling */}
      <div 
        ref={containerRef}
        className="preview-card" 
        style={{ 
          padding: '16px 0', 
          overflow: 'hidden', 
          flex: 1, 
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          backgroundColor: '#78909c', // slate-like contrast background for PDF sheet
          minHeight: scale < 1 ? `${1122 * scale + 32}px` : '1162px',
          height: scale < 1 ? `${1122 * scale + 32}px` : 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative'
        }}
      >
        <div style={{
          width: '794px',
          height: '1122px',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0
        }}>
          <div 
            id="invoice-preview-capture" 
            className="invoice-preview-container" 
            style={{ 
              padding: '30px 50px 50px 50px', 
              backgroundColor: '#ffffff', 
              width: '794px', // Standard A4 width at 96 DPI
              height: '1122px', // A4 height scale for better aspect ratio
              boxSizing: 'border-box',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: '#333',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '0 auto',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
          {/* Main Invoice Contents */}
          <div>
            {/* Header: Logo & Sender (Left) vs Title & Metadata (Right) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
              {/* Left Column: Logo & Sender Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invoiceData?.sender?.logoUrl ? (
                  <img 
                    src={invoiceData.sender.logoUrl} 
                    alt="Company Logo" 
                    style={{ maxHeight: '60px', maxWidth: '240px', objectFit: 'contain', alignSelf: 'flex-start' }}
                  />
                ) : (
                  <div style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#94a3b8',
                    border: '1px dashed #cbd5e1',
                    display: 'inline-block',
                    alignSelf: 'flex-start'
                  }}>
                    SEBA POINT
                  </div>
                )}
                
                <div style={{ color: '#555', lineHeight: '1.5' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#2c3e50', marginBottom: '4px' }}>
                    {invoiceData?.sender?.name || 'Seba Point'}
                  </div>
                  {invoiceData?.sender?.address && (
                    <div style={{ fontSize: '13px', whiteSpace: 'pre-line', maxWidth: '380px', marginBottom: '4px' }}>
                      {invoiceData.sender.address}
                    </div>
                  )}
                  <div style={{ fontSize: '13px' }}>
                    {invoiceData?.sender?.phone && <span>Tel: {invoiceData.sender.phone}</span>}
                    {invoiceData?.sender?.phone && invoiceData?.sender?.email && <span> &nbsp;|&nbsp; </span>}
                    {invoiceData?.sender?.email && <span>Email: {invoiceData.sender.email}</span>}
                  </div>
                  {invoiceData?.sender?.taxId && (
                    <div style={{ fontSize: '13px', marginTop: '2px' }}>
                      Tax ID: {invoiceData.sender.taxId}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Invoice Title & Details */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <h2 style={{ 
                  fontSize: '38px', 
                  fontWeight: 800, 
                  color: accentColor, 
                  margin: '0 0 4px 0',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  lineHeight: '1.1'
                }}>
                  INVOICE
                </h2>
                
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#2c3e50', marginBottom: '15px' }}>
                  #{invoiceData?.invoiceNumber || 'INV-0001'}
                </div>

                {/* Metadata Grid */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <table style={{ borderCollapse: 'collapse', fontSize: '13px', color: '#555' }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: 600, color: '#7f8c8d', padding: '2px 8px 2px 0', textAlign: 'right' }}>Date:</td>
                        <td style={{ padding: '2px 0', textAlign: 'left', fontWeight: 500, color: '#333', minWidth: '95px' }}>{formatDate(invoiceData?.issueDate)}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600, color: '#7f8c8d', padding: '2px 8px 2px 0', textAlign: 'right' }}>Due Date:</td>
                        <td style={{ padding: '2px 0', textAlign: 'left', fontWeight: 500, color: '#333', minWidth: '95px' }}>{formatDate(invoiceData?.dueDate)}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: 600, color: '#7f8c8d', padding: '2px 8px 2px 0', textAlign: 'right' }}>Terms:</td>
                        <td style={{ padding: '2px 0', textAlign: 'left', fontWeight: 500, color: '#333', minWidth: '95px' }}>{invoiceData?.paymentTerms}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Divider Line 1 */}
            <div style={{ borderBottom: '1.5px solid #e2e8f0', marginBottom: '25px' }}></div>

            {/* Bill To Section */}
            <div style={{ marginBottom: '25px', color: '#555', lineHeight: '1.5' }}>
              <div style={{ 
                fontSize: '12px', 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px', 
                color: '#7f8c8d', 
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                BILL TO
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#2c3e50', marginBottom: '4px' }}>
                {invoiceData?.client?.name || 'Client Name'}
              </div>
              {invoiceData?.client?.address && (
                <div style={{ fontSize: '13px', whiteSpace: 'pre-line', maxWidth: '380px', marginBottom: '4px' }}>
                  {invoiceData.client.address}
                </div>
              )}
              <div style={{ fontSize: '13px' }}>
                {invoiceData?.client?.phone && <span>Tel: {invoiceData.client.phone}</span>}
                {invoiceData?.client?.phone && invoiceData?.client?.email && <span> &nbsp;|&nbsp; </span>}
                {invoiceData?.client?.email && <span>Email: {invoiceData.client.email}</span>}
              </div>
              {invoiceData?.client?.taxId && (
                <div style={{ fontSize: '13px', marginTop: '2px' }}>
                  Tax ID: {invoiceData.client.taxId}
                </div>
              )}
            </div>

            {/* Divider Line 2 */}
            <div style={{ borderBottom: '1.5px solid #e2e8f0', marginBottom: '20px' }}></div>
            
            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
              <thead>
                <tr>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '12px 10px', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: '#2c3e50',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: `2.5px solid ${accentColor}`,
                    width: '6%'
                  }}>
                    SL
                  </th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '12px 10px', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: '#2c3e50',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: `2.5px solid ${accentColor}`,
                    width: '44%'
                  }}>
                    Description
                  </th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '12px 10px', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: '#2c3e50',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: `2.5px solid ${accentColor}`,
                    width: '12%'
                  }}>
                    Qty
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '12px 10px', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: '#2c3e50',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: `2.5px solid ${accentColor}`,
                    width: '18%'
                  }}>
                    Price
                  </th>
                  <th style={{ 
                    textAlign: 'right', 
                    padding: '12px 10px', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: '#2c3e50',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottom: `2.5px solid ${accentColor}`,
                    width: '20%'
                  }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {(invoiceData?.items || []).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ 
                      padding: '14px 10px', 
                      fontSize: '14px', 
                      color: '#555',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: 600
                    }}>
                      {idx + 1}
                    </td>
                    <td style={{ 
                      padding: '14px 10px', 
                      fontSize: '14px', 
                      color: '#333',
                      verticalAlign: 'middle'
                    }}>
                      {item.description || 'Line item description'}
                    </td>
                    <td style={{ 
                      padding: '14px 10px', 
                      fontSize: '14px', 
                      color: '#555',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      {parseFloat(item.quantity) || 0}
                    </td>
                    <td style={{ 
                      padding: '14px 10px', 
                      fontSize: '14px', 
                      color: '#555',
                      textAlign: 'right',
                      verticalAlign: 'middle'
                    }}>
                      {formatCurrency(parseFloat(item.unitPrice) || 0)}
                    </td>
                    <td style={{ 
                      padding: '14px 10px', 
                      fontSize: '14px', 
                      color: '#333',
                      fontWeight: 600,
                      textAlign: 'right',
                      verticalAlign: 'middle'
                    }}>
                      {formatCurrency(item.amount || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
              <table style={{ width: '280px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 10px', fontSize: '14px', color: '#7f8c8d', fontWeight: 500, textAlign: 'left' }}>Subtotal:</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#333' }}>
                      {formatCurrency(invoiceData?.subtotal)}
                    </td>
                  </tr>
                  
                  {parseFloat(invoiceData?.globalDiscountRate) > 0 && (
                    <tr>
                      <td style={{ padding: '8px 10px', fontSize: '14px', color: '#7f8c8d', fontWeight: 500, textAlign: 'left' }}>Discount ({invoiceData.globalDiscountRate}%):</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: '14px', color: '#e74c3c', fontWeight: 600 }}>
                        -{formatCurrency(invoiceData.discountTotal)}
                      </td>
                    </tr>
                  )}

                  {parseFloat(invoiceData?.globalTaxRate) > 0 && (
                    <tr>
                      <td style={{ padding: '8px 10px', fontSize: '14px', color: '#7f8c8d', fontWeight: 500, textAlign: 'left' }}>{invoiceData.taxName || 'Tax'} ({invoiceData.globalTaxRate}%):</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        {formatCurrency(invoiceData.taxTotal)}
                      </td>
                    </tr>
                  )}

                  {parseFloat(invoiceData?.shippingFee) > 0 && (
                    <tr>
                      <td style={{ padding: '8px 10px', fontSize: '14px', color: '#7f8c8d', fontWeight: 500, textAlign: 'left' }}>Shipping:</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: '14px', fontWeight: 600, color: '#333' }}>
                        {formatCurrency(parseFloat(invoiceData.shippingFee))}
                      </td>
                    </tr>
                  )}

                  <tr style={{ fontSize: '18px', fontWeight: 800, color: accentColor }}>
                    <td style={{ padding: '12px 10px 5px 10px', textAlign: 'left' }}>Total:</td>
                    <td style={{ padding: '12px 10px 5px 10px', textAlign: 'right' }}>
                      {formatCurrency(invoiceData?.total)}
                    </td>
                  </tr>

                  {parseFloat(invoiceData?.amountPaid) > 0 && (
                    <>
                      <tr>
                        <td style={{ padding: '8px 10px', fontSize: '13px', color: '#7f8c8d', textAlign: 'left' }}>Amount Paid:</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 600, fontSize: '13px' }}>
                          {formatCurrency(invoiceData.amountPaid)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderTop: '1px dashed #cbd5e1', padding: '8px 10px', fontWeight: 700, fontSize: '14px', color: '#2c3e50', textAlign: 'left' }}>Balance Due:</td>
                        <td style={{ borderTop: '1px dashed #cbd5e1', padding: '8px 10px', textAlign: 'right', fontWeight: 700, fontSize: '14px', color: '#2c3e50' }}>
                          {formatCurrency(invoiceData.balanceDue)}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Section */}
          <div style={{ marginTop: '50px' }}>
            {invoiceData?.notes && (
              <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                <p style={{ whiteSpace: 'pre-line', fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                  {invoiceData.notes}
                </p>
              </div>
            )}
            
            <div style={{ 
              borderTop: '1px solid #ecf0f1', 
              paddingTop: '20px', 
              textAlign: 'center', 
              fontSize: '11px', 
              color: '#95a5a6'
            }}>
              <p style={{ margin: '0 0 5px 0' }}>{formatFooterDate()} &bull; Seba Invoice - Premium Dynamic Invoice Generator</p>
              <p style={{ margin: 0 }}>
                <a href="https://seba-point-sable.vercel.app/#editor" target="_blank" rel="noreferrer" style={{ color: '#3498db', textDecoration: 'none' }}>
                  https://seba-point-sable.vercel.app/#editor
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}

export default InvoicePreview;
