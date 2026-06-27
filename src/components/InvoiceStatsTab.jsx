import React from 'react';
import { BarChart3, Users, DollarSign, Award, Percent } from 'lucide-react';

function InvoiceStatsTab({ invoices }) {
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

  // Compile monthly sales and client analytics
  const compileAnalytics = () => {
    const monthlyMap = {};
    const clientMap = {};
    let totalRevenue = 0;
    let totalPaid = 0;
    let uniqueClients = new Set();

    invoices.forEach(inv => {
      // 1. Group by month
      if (inv.createdAt) {
        const date = new Date(inv.createdAt);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyMap[monthYear]) {
          monthlyMap[monthYear] = { revenue: 0, count: 0 };
        }
        monthlyMap[monthYear].revenue += inv.total;
        monthlyMap[monthYear].count += 1;
      }

      // 2. Group by client
      if (inv.client && inv.client.name) {
        const clientName = inv.client.name;
        uniqueClients.add(clientName);
        if (!clientMap[clientName]) {
          clientMap[clientName] = { spent: 0, count: 0, email: inv.client.email };
        }
        clientMap[clientName].spent += inv.total;
        clientMap[clientName].count += 1;
      }

      totalRevenue += inv.total;
      totalPaid += inv.amountPaid || 0;
    });

    const monthlyStats = Object.keys(monthlyMap).map(month => ({
      month,
      revenue: monthlyMap[month].revenue,
      count: monthlyMap[month].count
    })).sort((a, b) => new Date(a.month) - new Date(b.month));

    const clientStats = Object.keys(clientMap).map(name => ({
      name,
      spent: clientMap[name].spent,
      count: clientMap[name].count,
      email: clientMap[name].email
    })).sort((a, b) => b.spent - a.spent); // Top spending clients first

    const maxMonthlyRevenue = Math.max(...monthlyStats.map(s => s.revenue), 1);
    const maxClientSpent = Math.max(...clientStats.map(c => c.spent), 1);

    return { 
      monthlyStats, 
      clientStats, 
      totalRevenue, 
      totalPaid, 
      uniqueClientsCount: uniqueClients.size,
      maxMonthlyRevenue,
      maxClientSpent
    };
  };

  const { 
    monthlyStats, 
    clientStats, 
    totalRevenue, 
    totalPaid, 
    uniqueClientsCount, 
    maxMonthlyRevenue,
    maxClientSpent 
  } = compileAnalytics();

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      <h3 style={{ 
        fontSize: '1.5rem', 
        color: '#0f172a', 
        borderBottom: '1px solid #f1f5f9', 
        paddingBottom: '1rem', 
        marginBottom: '2rem',
        fontWeight: 800,
        fontFamily: "'Outfit', sans-serif"
      }}>
        Executive Financial Analytics & Stats
      </h3>

      {invoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <BarChart3 size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
          <p>No billing or invoice data is available yet to compile analytics.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Key Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Billings</span>
                <DollarSign size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{formatCurrency(totalRevenue)}</div>
              <div style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>Total generated invoices</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Collected</span>
                <Percent size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>{formatCurrency(totalPaid)}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem', fontWeight: 600 }}>
                {totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0}% Liquidity Rate
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Clients</span>
                <Users size={18} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{uniqueClientsCount}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem', fontWeight: 600 }}>Unique client accounts</div>
            </div>
          </div>

          {/* SVG Split Column Grid */}
          <div className="stats-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            
            {/* Column 1: Month over Month chart */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', color: '#334155', fontWeight: 750, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>
                Monthly Billing Breakdown
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {monthlyStats.map((item, index) => {
                  const pct = (item.revenue / maxMonthlyRevenue) * 100;
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                        <span>{item.month}</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatCurrency(item.revenue)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '14px', borderRadius: '20px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, backgroundColor: '#16a34a', height: '100%', borderRadius: '20px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '65px', textAlign: 'right' }}>
                          {item.count} invoice{item.count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Top Clients Leaderboard */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Award size={18} style={{ color: '#eab308' }} />
                <h4 style={{ margin: 0, color: '#334155', fontWeight: 750, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" }}>
                  Top Client Spending Leaderboard
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {clientStats.slice(0, 5).map((client, index) => {
                  const pct = (client.spent / maxClientSpent) * 100;
                  return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                        <div>
                          <span style={{ color: '#94a3b8', marginRight: '0.5rem', fontWeight: 700 }}>#{index + 1}</span>
                          <span style={{ color: '#334155' }}>{client.name}</span>
                        </div>
                        <span style={{ fontWeight: 750, color: '#0f172a' }}>{formatCurrency(client.spent)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '8px', borderRadius: '20px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, backgroundColor: '#3b82f6', height: '100%', borderRadius: '20px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '65px', textAlign: 'right' }}>
                          {client.count} order{client.count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default InvoiceStatsTab;
