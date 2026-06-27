import React, { useState, useEffect } from 'react';
import InvoicePreview from './InvoicePreview';
import { 
  Trash2, Plus, Save, X, Calendar, DollarSign, Settings2, FileText, Building2, User, Lock, CheckCircle 
} from 'lucide-react';

const DEFAULT_SENDER_KEY = 'seba_invoice_default_sender';
const DRAFT_KEY = 'seba_invoice_form_draft';

function InvoiceForm({ invoice, onSave, onCancel, invoices, settings }) {
  // Determine if this invoice is finalized and locked
  const isLocked = invoice && invoice.status !== 'Draft';

  const getInitialState = () => {
    const brandLogo = settings?.logo || '/logo.png';

    if (invoice) {
      const prep = {
        ...invoice,
        issueDate: invoice.issueDate ? invoice.issueDate.split('T')[0] : '',
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : ''
      };
      if (prep.sender && !prep.sender.logoUrl) {
        prep.sender.logoUrl = brandLogo;
      }
      return prep;
    }

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.sender && !parsed.sender.logoUrl) {
          parsed.sender.logoUrl = brandLogo;
        }
        // Ensure default items list isn't empty
        if (!parsed.items || parsed.items.length === 0) {
          parsed.items = [{ description: 'TL', quantity: 1, unitPrice: 3500, taxRate: 0, discount: 0, amount: 3500 }];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse draft, resetting defaults', e);
      }
    }

    const savedDefaultSender = localStorage.getItem(DEFAULT_SENDER_KEY);
    let defaultSender = savedDefaultSender ? JSON.parse(savedDefaultSender) : null;
    
    // If it's the old hardcoded name or empty, force the new requested defaults
    if (!defaultSender || defaultSender.name === 'HAFEEZ MD ABDUR RASHID KHAN') {
      defaultSender = {
        name: 'Seba Point',
        email: 'sebapoint01@gmail.com',
        address: 'Bonani Dhaka 1203 Bangladesh',
        phone: '01813884475',
        logoUrl: brandLogo,
        taxId: ''
      };
    }
    
    // Ensure logoUrl is not empty
    if (!defaultSender.logoUrl) {
      defaultSender.logoUrl = brandLogo;
    }

    // Logical sequential invoice numbering
    let maxNum = 0;
    if (invoices && invoices.length > 0) {
      invoices.forEach(inv => {
        const numPart = parseInt(inv.invoiceNumber.replace(/[^\d]/g, ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      });
    }
    const nextNum = maxNum > 0 ? maxNum + 1 : 1;
    const pad = (num, size) => {
      let s = "0000" + num;
      return s.substring(s.length - size);
    };
    const suggestedNum = `INV-${pad(nextNum, 4)}`;

    const today = new Date().toISOString().split('T')[0];
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      invoiceNumber: suggestedNum,
      issueDate: today,
      dueDate: twoWeeksLater,
      paymentTerms: 'Net 14',
      currency: 'BDT',
      accentColor: '#16a34a',
      sender: defaultSender,
      client: {
        name: '',
        email: '',
        address: '',
        phone: '',
        taxId: ''
      },
      items: [
        { description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, amount: 0 }
      ],
      globalDiscountRate: 0,
      globalTaxRate: 0,
      taxName: 'Tax',
      shippingFee: 0,
      subtotal: 3500,
      discountTotal: 0,
      taxTotal: 0,
      total: 3500,
      amountPaid: 3500,
      balanceDue: 0,
      status: 'Draft', // Default status is draft
      notes: 'Thank you for your business.',
      terms: ''
    };
  };

  const [invoiceData, setInvoiceData] = useState(getInitialState);
  const [logoInput, setLogoInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState('');

  // Auto-save draft locally (only if not editing an existing invoice and not locked)
  useEffect(() => {
    if (!invoice && !isLocked) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(invoiceData));
    }
  }, [invoiceData, invoice, isLocked]);

  // Update default logo when settings load asynchronously
  useEffect(() => {
    if (settings?.logo && !invoice) {
      setInvoiceData(prev => ({
        ...prev,
        sender: {
          ...prev.sender,
          logoUrl: settings.logo // Always use the latest CMS brand logo for new invoices
        }
      }));
    }
  }, [settings, invoice]);

  // Auto-calculate Due Date based on Issue Date and Payment Terms
  useEffect(() => {
    if (!invoiceData.issueDate || isLocked) return;
    
    const issue = new Date(invoiceData.issueDate);
    if (isNaN(issue.getTime())) return;
    
    let daysToAdd = 0;
    switch (invoiceData.paymentTerms) {
      case 'Net 7':
        daysToAdd = 7;
        break;
      case 'Net 14':
        daysToAdd = 14;
        break;
      case 'Net 30':
        daysToAdd = 30;
        break;
      case 'Net 60':
        daysToAdd = 60;
        break;
      case 'Due on Receipt':
      default:
        daysToAdd = 0;
        break;
    }
    
    const due = new Date(issue.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const dueStr = due.toISOString().split('T')[0];
    
    setInvoiceData(prev => {
      if (prev.dueDate === dueStr) return prev;
      return { ...prev, dueDate: dueStr };
    });
  }, [invoiceData.issueDate, invoiceData.paymentTerms, isLocked]);

  // Recalculate totals
  useEffect(() => {
    const calculatedItems = invoiceData.items.map(item => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const discountPct = parseFloat(item.discount) || 0;
      const taxPct = parseFloat(item.taxRate) || 0;

      let base = qty * price;
      let discVal = base * (discountPct / 100);
      let afterDiscount = base - discVal;
      let taxVal = afterDiscount * (taxPct / 100);
      let finalAmount = afterDiscount + taxVal;

      return {
        ...item,
        amount: Math.round(finalAmount * 100) / 100
      };
    });

    const subtotal = calculatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const globalDiscount = subtotal * ((parseFloat(invoiceData.globalDiscountRate) || 0) / 100);
    const afterGlobalDiscount = subtotal - globalDiscount;
    const globalTax = afterGlobalDiscount * ((parseFloat(invoiceData.globalTaxRate) || 0) / 100);
    const shipping = parseFloat(invoiceData.shippingFee) || 0;
    const grandTotal = afterGlobalDiscount + globalTax + shipping;
    
    const total = Math.round(grandTotal * 100) / 100;
    const amountPaid = parseFloat(invoiceData.amountPaid) || 0;
    const balanceDue = Math.max(0, Math.round((total - amountPaid) * 100) / 100);

    setInvoiceData(prev => ({
      ...prev,
      items: calculatedItems.map((item, idx) => ({
        ...item,
        amount: calculatedItems[idx].amount
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal: Math.round(globalDiscount * 100) / 100,
      taxTotal: Math.round(globalTax * 100) / 100,
      total,
      balanceDue
    }));
  }, [
    invoiceData.items.map(item => `${item.quantity}-${item.unitPrice}-${item.discount}-${item.taxRate}`).join(','),
    invoiceData.globalDiscountRate,
    invoiceData.globalTaxRate,
    invoiceData.shippingFee,
    invoiceData.amountPaid
  ]);

  const handleNestedChange = (section, field, value) => {
    if (isLocked) return;
    setInvoiceData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleItemChange = (index, field, value) => {
    if (isLocked) return;
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const handleAddItem = () => {
    if (isLocked) return;
    setInvoiceData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, amount: 0 }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    if (isLocked) return;
    if (invoiceData.items.length === 1) return;
    const newItems = invoiceData.items.filter((_, idx) => idx !== index);
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const handleLogoUpload = (e) => {
    if (isLocked) return;
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image is too large. Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      handleNestedChange('sender', 'logoUrl', uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (e) => {
    if (isLocked) return;
    e.stopPropagation();
    handleNestedChange('sender', 'logoUrl', '');
  };

  // Base Save Function
  const saveInvoiceToDatabase = async (statusToSave) => {
    if (!invoiceData.invoiceNumber.trim()) {
      setErrorMsg('Invoice number is required.');
      return;
    }
    if (!invoiceData.client.name.trim()) {
      setErrorMsg('Client name is required.');
      return;
    }
    if (invoiceData.items.some(item => !item.description.trim())) {
      setErrorMsg('Please describe all line items.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      if (statusToSave === 'Draft') {
        localStorage.setItem(DEFAULT_SENDER_KEY, JSON.stringify(invoiceData.sender));
      }

      const method = invoice ? 'PUT' : 'POST';
      const url = invoice ? `/api/invoices/${invoice._id}` : '/api/invoices';

      const payload = {
        ...invoiceData,
        status: statusToSave
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save invoice');
      }

      localStorage.removeItem(DRAFT_KEY);
      onSave();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server connection failed. Could not save.');
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Action: Save as Draft
  const handleSaveDraft = () => {
    saveInvoiceToDatabase('Draft');
  };

  // 2. Action: Trigger finalization workflow
  const triggerFinalization = () => {
    if (!invoiceData.invoiceNumber.trim()) {
      setErrorMsg('Invoice number is required.');
      return;
    }
    if (!invoiceData.client.name.trim()) {
      setErrorMsg('Client name is required.');
      return;
    }
    if (invoiceData.items.some(item => !item.description.trim())) {
      setErrorMsg('Please describe all line items.');
      return;
    }
    setErrorMsg('');
    setShowConfirmModal(true);
  };

  const handleConfirmFinalize = () => {
    if (confirmPhrase !== 'CONFIRM') return;
    setShowConfirmModal(false);
    // Finalize status: default to Unpaid if it was Draft, otherwise keep selected (Paid/Unpaid/Overdue)
    const status = invoiceData.status === 'Draft' ? 'Unpaid' : invoiceData.status;
    saveInvoiceToDatabase(status);
  };

  return (
    <div className="invoice-editor-view">
      
      {/* Locked Notice Banner */}
      {isLocked && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e3a8a',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 600
        }} className="no-print">
          <Lock size={18} />
          <span>This invoice is finalized and locked. You can view, print, or download PDF, but edits are disabled.</span>
        </div>
      )}

      {/* Sticky Action Bar */}
      <div className="sticky-action-bar no-print">
        <div className="page-title" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLocked && <Lock size={20} style={{ color: '#64748b' }} />}
            <h1 style={{ margin: 0, fontSize: '1.4rem' }}>
              {invoice ? `${isLocked ? 'View' : 'Edit'} Invoice ${invoice.invoiceNumber}` : 'Create New Invoice'}
            </h1>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <X size={16} />
            <span className="hidden-xs">Cancel</span>
          </button>
          
          {!isLocked && (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={handleSaveDraft}
                disabled={isSaving}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#cbd5e1' }}
              >
                <Save size={16} />
                <span className="hidden-xs">Save Draft</span>
              </button>
              <button 
                className="btn btn-primary" 
                onClick={triggerFinalization}
                disabled={isSaving}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#16a34a', border: '1px solid #16a34a' }}
              >
                <CheckCircle size={16} />
                <span className="hidden-xs">Confirm</span>
              </button>
            </>
          )}
        </div>
      </div>



      {errorMsg && (
        <div className="no-print" style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          color: '#ef4444',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 650
        }}>
          {errorMsg}
        </div>
      )}

      {/* Stack: Form on Top, Live Preview on Bottom */}
      <div className="invoice-grid">
        
        {/* Editor Form */}
        <div className="form-sections no-print" style={{ opacity: isLocked ? 0.85 : 1 }}>
          
          {/* Section: Logo & Layout */}
          <div className="premium-card">
            <div className="form-section-title">
              <Settings2 size={16} />
              <span>Branding & General Options</span>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Upload Logo</label>
                <div 
                  className="logo-uploader" 
                  onClick={() => !isLocked && document.getElementById('logo-file-input').click()}
                  style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                >
                  <input 
                    type="file" 
                    id="logo-file-input" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    style={{ display: 'none' }}
                    disabled={isLocked}
                  />
                  {invoiceData.sender.logoUrl ? (
                    <div className="logo-preview-container">
                      <img src={invoiceData.sender.logoUrl} alt="Logo preview" />
                      {!isLocked && <button type="button" onClick={handleRemoveLogo}>✕</button>}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Click to upload (JPG, PNG, max 2MB)
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Theme Accent Color</label>
                <input 
                  type="color" 
                  className="form-control" 
                  value={invoiceData.accentColor} 
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, accentColor: e.target.value }))}
                  style={{ height: '44px', padding: '4px', cursor: isLocked ? 'not-allowed' : 'pointer' }}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select 
                  className="form-control" 
                  value={invoiceData.currency}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, currency: e.target.value }))}
                  disabled={isLocked}
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Invoice Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. INV-1001" 
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Payment Terms</label>
                <select 
                  className="form-control" 
                  value={invoiceData.paymentTerms}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  disabled={isLocked}
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 7">Net 7</option>
                  <option value="Net 14">Net 14</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>
              <div className="form-group">
                <label>Issue Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={invoiceData.issueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, issueDate: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>

          {/* Section: Sender Info */}
          <div className="premium-card">
            <div className="form-section-title">
              <Building2 size={16} />
              <span>Bill From (Your Business)</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="ACME Corp" 
                  value={invoiceData.sender.name}
                  onChange={(e) => handleNestedChange('sender', 'name', e.target.value)}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="billing@acme.com" 
                  value={invoiceData.sender.email}
                  onChange={(e) => handleNestedChange('sender', 'email', e.target.value)}
                  disabled={isLocked}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Address</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="123 Corporate St, Ste 100, Metropolis" 
                  value={invoiceData.sender.address}
                  onChange={(e) => handleNestedChange('sender', 'address', e.target.value)}
                  style={{ resize: 'none' }}
                  disabled={isLocked}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+1 (555) 019-2834" 
                  value={invoiceData.sender.phone}
                  onChange={(e) => handleNestedChange('sender', 'phone', e.target.value)}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Tax ID / Registration</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="EIN-9928347" 
                  value={invoiceData.sender.taxId}
                  onChange={(e) => handleNestedChange('sender', 'taxId', e.target.value)}
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>

          {/* Section: Totals & Settings */}
          <div className="premium-card">
            <div className="form-section-title">
              <User size={16} />
              <span>Bill To (Client Details)</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name / Business *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Seba Global" 
                  value={invoiceData.client.name}
                  onChange={(e) => handleNestedChange('client', 'name', e.target.value)}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Client Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="billing@sebaglobal.com" 
                  value={invoiceData.client.email}
                  onChange={(e) => handleNestedChange('client', 'email', e.target.value)}
                  disabled={isLocked}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Billing Address</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="456 Client Boulevard, Tower C, London" 
                  value={invoiceData.client.address}
                  onChange={(e) => handleNestedChange('client', 'address', e.target.value)}
                  style={{ resize: 'none' }}
                  disabled={isLocked}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Client Phone</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+44 20 7946 0958" 
                  value={invoiceData.client.phone}
                  onChange={(e) => handleNestedChange('client', 'phone', e.target.value)}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Client Tax ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="VAT-GB1234567" 
                  value={invoiceData.client.taxId}
                  onChange={(e) => handleNestedChange('client', 'taxId', e.target.value)}
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>
          
          {/* Section: Notes & Terms */}
          <div className="premium-card">
            <div className="form-section-title">
              <FileText size={16} />
              <span>Line Items</span>
            </div>
            
            {invoiceData.items.map((item, index) => (
              <div 
                key={index} 
                className="form-row invoice-item-row" 
                style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  paddingBottom: '1rem', 
                  marginBottom: '1rem'
                }}
              >
                <div className="form-group">
                  <label>SL</label>
                  <div style={{
                    padding: '0.75rem 0.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    textAlign: 'center',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '44px'
                  }}>
                    {index + 1}
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Premium Web Development Service" 
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    disabled={isLocked}
                  />
                </div>
                <div className="form-group">
                  <label>Qty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="1"
                    step="any"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    disabled={isLocked}
                  />
                </div>
                <div className="form-group">
                  <label>Unit Price</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    disabled={isLocked}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Total</label>
                    <div style={{ 
                      padding: '0.75rem 0.5rem', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      textAlign: 'right',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.9rem'
                    }}>
                      {item.amount.toFixed(2)}
                    </div>
                  </div>
                  {!isLocked && invoiceData.items.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => handleRemoveItem(index)}
                      style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', height: '44px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {!isLocked && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleAddItem}
                style={{ marginTop: '0.5rem' }}
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            )}
          </div>

          {/* Section: Global Settings & Subtotals */}
          <div className="premium-card">
            <div className="form-section-title">
              <DollarSign size={16} />
              <span>Taxes, Discounts & Payments</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Global Discount (%)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  max="100"
                  value={invoiceData.globalDiscountRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, globalDiscountRate: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Tax Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={invoiceData.taxName}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, taxName: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Global Tax Rate (%)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  max="100"
                  value={invoiceData.globalTaxRate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, globalTaxRate: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Shipping / Freight Fee</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  step="any"
                  value={invoiceData.shippingFee}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, shippingFee: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Amount Already Paid</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="0"
                  step="any"
                  value={invoiceData.amountPaid}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, amountPaid: e.target.value }))}
                  disabled={isLocked}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-control" 
                  value={invoiceData.status}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, status: e.target.value }))}
                  disabled={isLocked}
                >
                  <option value="Draft">Draft</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label>Footer Notes / Terms</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Thank you for your business. Payment is due within 14 days." 
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ resize: 'none' }}
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Live A4 PDF Preview Container at the bottom */}
        <div>
          <InvoicePreview invoiceData={invoiceData} />
        </div>

      </div>

      {/* Confirmation Finalization Modal Overlay */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }} className="no-print">
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: '#991b1b', 
              fontFamily: "'Outfit', sans-serif" 
            }}>
              Confirm Invoice Finalization
            </h4>
            
            <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
              <strong>This action will finalize the invoice.</strong>
              <br /><br />
              Once confirmed, this invoice will be added to the Invoice History as an official record. After finalization, the invoice content can no longer be edited. Only its payment status (Paid/Unpaid/Overdue) may be updated.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                color: '#475569', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase'
              }}>
                Type <code style={{ color: '#b91c1c', fontSize: '0.85rem', padding: '0.1rem 0.3rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>CONFIRM</code> to finalise:
              </label>
              <input 
                type="text" 
                className="form-control"
                placeholder="CONFIRM"
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                style={{ 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmPhrase('');
                }}
                style={{ fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                disabled={confirmPhrase !== 'CONFIRM'}
                onClick={handleConfirmFinalize}
                style={{ 
                  fontWeight: 700, 
                  backgroundColor: confirmPhrase === 'CONFIRM' ? '#b91c1c' : '#cbd5e1', 
                  border: 'none', 
                  cursor: confirmPhrase === 'CONFIRM' ? 'pointer' : 'not-allowed'
                }}
              >
                Confirm & Finalize
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default InvoiceForm;
