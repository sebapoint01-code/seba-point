import React from 'react';
import { DollarSign, Receipt, CreditCard, Clock, Plus, ArrowRight, Edit, Eye } from 'lucide-react';

function Dashboard({ invoices, onCreateInvoice, onEditInvoice }) {
  // Helper to format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
  const invoiceCount = invoices.length;

  const paidCount = invoices.filter(inv => inv.status === 'Paid').length;
  const unpaidCount = invoices.filter(inv => inv.status === 'Unpaid').length;
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;
  const draftCount = invoices.filter(inv => inv.status === 'Draft').length;

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="dashboard-view">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>Dashboard Overview</h1>
          <p>Real-time analytics and tracking of your business billings.</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateInvoice}>
          <Plus size={18} />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-grid">
        <div className="kpi-card">
          <div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Total Invoiced</div>
            <div className="kpi-value">{formatCurrency(totalInvoiced)}</div>
          </div>
          <div className="kpi-icon">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="kpi-card success">
          <div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Paid Received</div>
            <div className="kpi-value">{formatCurrency(totalPaid)}</div>
          </div>
          <div className="kpi-icon">
            <CreditCard size={24} />
          </div>
        </div>

        <div className="kpi-card warning">
          <div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Outstanding Due</div>
            <div className="kpi-value">{formatCurrency(totalOutstanding)}</div>
          </div>
          <div className="kpi-icon">
            <Clock size={24} />
          </div>
        </div>

        <div className="kpi-card info">
          <div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Invoices Generated</div>
            <div className="kpi-value">{invoiceCount}</div>
          </div>
          <div className="kpi-icon">
            <Receipt size={24} />
          </div>
        </div>
      </div>

      {/* Analytics & Summary Section */}
      <div className="dashboard-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Status Distribution */}
        <div style={{
          backgroundColor: '#fff', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Invoice Billing Ratios</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Progress Bar Container */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Paid ({paidCount} Invoices)</span>
                <span>{invoiceCount ? Math.round((paidCount / invoiceCount) * 100) : 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${invoiceCount ? (paidCount / invoiceCount) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--success)' 
                }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <span>Unpaid & Overdue ({unpaidCount + overdueCount} Invoices)</span>
                <span>{invoiceCount ? Math.round(((unpaidCount + overdueCount) / invoiceCount) * 100) : 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${invoiceCount ? ((unpaidCount + overdueCount) / invoiceCount) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--warning)' 
                }}></div>
              </div>
            </div>
            
            {invoiceCount === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                No invoice records found to build statistics.
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div style={{
          backgroundColor: 'var(--bg-sidebar)', 
          padding: '2rem', 
          borderRadius: 'var(--radius-lg)', 
          color: '#fff',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Easy Customization</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Click on "Create Invoice" to open the interactive live preview editor. You can select custom accent colors to instantly match your business's branding style.
          </p>
          <button className="btn btn-primary" onClick={onCreateInvoice} style={{ alignSelf: 'flex-start' }}>
            <span>Start Drafting</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Recent Invoices</h3>
        
        <div className="table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv._id}>
                  <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                  <td>{inv.client.name}</td>
                  <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(inv.total, inv.currency)}</td>
                  <td>
                    <span className={`badge badge-${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onEditInvoice(inv)}
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recentInvoices.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No invoices recorded yet. Start by generating your first invoice!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
