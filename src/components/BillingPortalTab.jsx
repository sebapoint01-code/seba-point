import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

function BillingPortalTab({ invoices, totalRevenue }) {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#0f172a', margin: 0 }}>Billing Panel</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/owner-panel/invoices')} 
            style={{ padding: '0.5rem 1.25rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            Manage Invoices
          </button>
          <button 
            onClick={() => navigate('/owner-panel/invoices/new')} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1.25rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={16} /> New Invoice
          </button>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>All-Time Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14532d', marginTop: '0.25rem' }}>৳{totalRevenue.toLocaleString()}</div>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>Total Invoices Issued</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.25rem' }}>{invoices.length}</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Click **Manage Invoices** above to search, edit, print, or review detailed invoice history and billing client information.
        </p>
      </div>
    </div>
  );
}

export default BillingPortalTab;
