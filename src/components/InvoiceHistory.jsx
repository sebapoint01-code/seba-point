import React, { useState } from 'react';
import { Search, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw, XCircle, Printer, Eye } from 'lucide-react';

function InvoiceHistory({ invoices, onEditInvoice, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState(null);

  // Helper to format currency dynamically
  const formatCurrency = (amount, currency = 'INR') => {
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
      default:
        return `${currency} ${formattedVal}`;
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Toggle paid/unpaid status
  const handleToggleStatus = async (invoice) => {
    const nextStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid';
    const amountPaid = nextStatus === 'Paid' ? invoice.total : 0;
    const balanceDue = nextStatus === 'Paid' ? 0 : invoice.total;

    setIsUpdating(invoice._id);
    try {
      const response = await fetch(`/api/invoices/${invoice._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, amountPaid, balanceDue })
      });
      if (!response.ok) throw new Error('Failed to update status');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Delete invoice
  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice? This action is permanent.')) return;
    setIsUpdating(invoiceId);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete invoice');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete invoice.');
    } finally {
      setIsUpdating(null);
    }
  };

  // Count invoices by status for tab indicators
  const getStatusCounts = () => {
    const counts = { All: 0, Paid: 0, Unpaid: 0, Overdue: 0, Draft: 0 };
    invoices.forEach(inv => {
      counts.All += 1;
      if (counts[inv.status] !== undefined) {
        counts[inv.status] += 1;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Filtering Logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.client.email && inv.client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #f1f5f9', 
        paddingBottom: '1.5rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }} className="no-print">
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Invoice History Ledger
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Review payments, print invoices, and update billing schedules for all corporate entries.
          </p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={onRefresh}
          disabled={isUpdating !== null}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 600 }}
        >
          <RefreshCw size={16} className={isUpdating ? 'spin-animation' : ''} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1.25rem', 
        marginBottom: '2rem'
      }} className="no-print">
        
        {/* Search */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by invoice number, client name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: '2.75rem', 
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          />
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#94a3b8' 
          }} />
        </div>

        {/* Tab Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.5rem'
        }}>
          {['All', 'Paid', 'Unpaid', 'Overdue', 'Draft'].map((status) => {
            const isActive = statusFilter === status;
            const count = statusCounts[status];
            
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#16a34a' : '#64748b',
                  cursor: 'pointer',
                  borderBottom: isActive ? '3px solid #16a34a' : '3px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.9rem'
                }}
              >
                <span>{status}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: isActive ? '#dcfce7' : '#f1f5f9', 
                  color: isActive ? '#15803d' : '#64748b', 
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* History Table Container */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
      }}>
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f8fafc', 
                borderBottom: '1px solid #e2e8f0', 
                color: '#475569', 
                fontSize: '0.8rem', 
                textTransform: 'uppercase', 
                fontWeight: 700 
              }}>
                <th style={{ padding: '1rem' }}>Invoice #</th>
                <th style={{ padding: '1rem' }}>Client Details</th>
                <th style={{ padding: '1rem' }}>Issue Date</th>
                <th style={{ padding: '1rem' }}>Due Date</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Balance Due</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }} className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr 
                  key={inv._id} 
                  style={{ 
                    borderBottom: '1px solid #f1f5f9', 
                    fontSize: '0.9rem',
                    opacity: isUpdating === inv._id ? 0.6 : 1,
                    transition: 'background-color 0.2s'
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#0f172a' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{inv.client.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inv.client.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', color: '#475569' }}>{formatDate(inv.issueDate)}</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#475569' }}>{formatDate(inv.dueDate)}</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(inv.total, inv.currency)}</td>
                  <td style={{ 
                    padding: '1.25rem 1rem', 
                    color: inv.balanceDue > 0 ? '#ea580c' : '#94a3b8',
                    fontWeight: inv.balanceDue > 0 ? 700 : 500
                  }}>
                    {formatCurrency(inv.balanceDue, inv.currency)}
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: 
                        inv.status === 'Paid' ? '#dcfce7' : 
                        inv.status === 'Unpaid' ? '#fef3c7' : 
                        inv.status === 'Overdue' ? '#fee2e2' : '#f1f5f9',
                      color: 
                        inv.status === 'Paid' ? '#15803d' : 
                        inv.status === 'Unpaid' ? '#b45309' : 
                        inv.status === 'Overdue' ? '#b91c1c' : '#475569'
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }} className="no-print">
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onEditInvoice(inv)}
                        title="Edit Invoice"
                        style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                      
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleStatus(inv)}
                        title={inv.status === 'Paid' ? "Mark as Unpaid" : "Mark as Paid"}
                        style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        {inv.status === 'Paid' ? (
                          <>
                            <XCircle size={13} style={{ color: '#ef4444' }} />
                            <span>Unpay</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} style={{ color: '#16a34a' }} />
                            <span>Pay</span>
                          </>
                        )}
                      </button>

                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDeleteInvoice(inv._id)}
                        style={{ color: '#ef4444', padding: '0.35rem 0.5rem' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                    No invoice records found matching your filters.
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

export default InvoiceHistory;
