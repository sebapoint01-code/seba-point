import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, CheckCircle2, XCircle, TrendingUp, AlertTriangle, CheckSquare, Clock } from 'lucide-react';

function BillingPortalTab({ invoices, totalRevenue, onEditInvoice, onRefresh }) {
  const navigate = useNavigate();
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

  // Financial Metrics Calculation
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyRevenue = invoices.reduce((sum, inv) => {
    if (!inv.createdAt) return sum;
    const d = new Date(inv.createdAt);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return sum + inv.total;
    }
    return sum;
  }, 0);

  const outstandingBalance = invoices.reduce((sum, inv) => {
    if (inv.status !== 'Paid') {
      return sum + (inv.balanceDue || 0);
    }
    return sum;
  }, 0);

  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const collectionRate = totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

  // Toggle invoice status directly from dashboard
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

  // Delete invoice directly from dashboard
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

  // Generate Month-Over-Month SVG chart data
  const getChartData = () => {
    const monthlyMap = {};
    // Seed last 6 months to ensure chart isn't empty and has standard spacing
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyMap[key] = 0;
    }

    invoices.forEach(inv => {
      if (!inv.createdAt) return;
      const d = new Date(inv.createdAt);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyMap[key] !== undefined) {
        monthlyMap[key] += inv.total;
      } else {
        // Only add if within timeframe or dynamic keys
        monthlyMap[key] = inv.total;
      }
    });

    const dataArray = Object.keys(monthlyMap).map(key => ({
      label: key,
      value: monthlyMap[key]
    }));

    const maxValue = Math.max(...dataArray.map(d => d.value), 1000);
    return { dataArray, maxValue };
  };

  const { dataArray: chartData, maxValue: chartMax } = getChartData();

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Top Header Block */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #f1f5f9', 
        paddingBottom: '1.5rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Billing & Business Dashboard
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Real-time corporate invoices, sales tracking, and revenue statistics.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => navigate('/owner-panel/invoices')} 
            style={{ 
              padding: '0.6rem 1.25rem', 
              backgroundColor: '#1e293b', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
          >
            Manage Invoices
          </button>
          <button 
            onClick={() => navigate('/owner-panel/invoices/new')} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.6rem 1.25rem', 
              backgroundColor: '#16a34a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 700, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(22, 163, 74, 0.15)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          >
            <Plus size={16} /> New Invoice
          </button>
        </div>
      </div>

      {/* 4-Column Business KPI metrics grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2.5rem' 
      }}>
        {/* Metric 1 */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '10px', color: '#2563eb' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>All-Time Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
              {formatCurrency(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '0.75rem', borderRadius: '10px', color: '#16a34a' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Sales</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '0.15rem' }}>
              {formatCurrency(monthlyRevenue)}
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '0.75rem', borderRadius: '10px', color: '#ea580c' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outstanding Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c', marginTop: '0.15rem' }}>
              {formatCurrency(outstandingBalance)}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: '#fdf2f8', padding: '0.75rem', borderRadius: '10px', color: '#db2777' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collection Rate</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#db2777', marginTop: '0.15rem' }}>
              {collectionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics: Custom Interactive SVG Chart */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px', 
        padding: '2rem',
        marginBottom: '2.5rem',
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.01)'
      }}>
        <h4 style={{ margin: '0 0 1.5rem 0', color: '#334155', fontWeight: 750, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>
          Revenue Trend (Last 6 Months)
        </h4>

        {/* Custom SVG Bar Chart */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 600 240" style={{ width: '100%', height: 'auto', maxHeight: '240px' }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="40" y1="40" x2="560" y2="40" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="100" x2="560" y2="100" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="160" x2="560" y2="160" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="200" x2="560" y2="200" stroke="#cbd5e1" strokeWidth="1" />

            {/* Render Bars */}
            {chartData.map((d, index) => {
              const x = 70 + index * 80;
              const barHeight = chartMax > 0 ? (d.value / chartMax) * 140 : 0;
              const y = 200 - barHeight;
              
              return (
                <g key={index} style={{ cursor: 'pointer' }}>
                  {/* Tooltip background (hidden by default, shows on hover in modern browsers with pure CSS) */}
                  <rect 
                    x={x - 20} 
                    y={y - 30} 
                    width="70" 
                    height="22" 
                    rx="4" 
                    fill="#1e293b" 
                    className="chart-tooltip"
                    style={{ opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} 
                  />
                  <text 
                    x={x + 15} 
                    y={y - 15} 
                    fill="white" 
                    fontSize="9" 
                    fontWeight="700" 
                    textAnchor="middle"
                    className="chart-tooltip-text"
                    style={{ opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }}
                  >
                    {formatCurrency(d.value).split('.')[0]}
                  </text>

                  {/* SVG Bar */}
                  <rect
                    x={x}
                    y={y}
                    width="30"
                    height={barHeight}
                    rx="4"
                    fill="url(#barGradient)"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.fill = '#15803d';
                      const parent = e.currentTarget.parentNode;
                      parent.querySelector('.chart-tooltip').style.opacity = '1';
                      parent.querySelector('.chart-tooltip-text').style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.fill = 'url(#barGradient)';
                      const parent = e.currentTarget.parentNode;
                      parent.querySelector('.chart-tooltip').style.opacity = '0';
                      parent.querySelector('.chart-tooltip-text').style.opacity = '0';
                    }}
                  />
                  
                  {/* X Axis Label */}
                  <text 
                    x={x + 15} 
                    y="220" 
                    fill="#64748b" 
                    fontSize="11" 
                    fontWeight="600" 
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Recent Invoices List Section */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px', 
        padding: '2rem',
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.01)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: 0, color: '#334155', fontWeight: 750, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>
            Recent Invoice Activity
          </h4>
          <button 
            onClick={() => navigate('/owner-panel/invoices')} 
            style={{ fontSize: '0.85rem', color: '#16a34a', border: 'none', background: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            See All Invoices &rarr;
          </button>
        </div>

        {/* Responsive Recent Invoices Table */}
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                <th style={{ padding: '0.75rem 1rem' }}>Invoice #</th>
                <th style={{ padding: '0.75rem 1rem' }}>Client</th>
                <th style={{ padding: '0.75rem 1rem' }}>Issued Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv._id} style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  fontSize: '0.9rem',
                  opacity: isUpdating === inv._id ? 0.5 : 1,
                  transition: 'background-color 0.2s'
                }} className="table-row-hover">
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{inv.client.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inv.client.email}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569' }}>{formatDate(inv.issueDate)}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(inv.total, inv.currency)}</td>
                  <td style={{ padding: '1rem' }}>
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
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onEditInvoice(inv)}
                        title="Edit Invoice"
                        disabled={isUpdating !== null}
                        style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleToggleStatus(inv)}
                        title={inv.status === 'Paid' ? "Mark as Unpaid" : "Mark as Paid"}
                        disabled={isUpdating !== null}
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
                        disabled={isUpdating !== null}
                        style={{ color: '#ef4444', padding: '0.35rem 0.5rem' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                    No invoice activity recorded. Click **New Invoice** to issue your first invoice.
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

export default BillingPortalTab;
