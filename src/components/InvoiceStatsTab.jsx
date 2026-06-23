import React from 'react';
import { BarChart3 } from 'lucide-react';

function InvoiceStatsTab({ invoices }) {
  // Generate Month-Over-Month Invoice Stats
  const generateStats = () => {
    const statsMap = {};
    let totalRevenue = 0;
    
    invoices.forEach(inv => {
      if (!inv.createdAt) return;
      const date = new Date(inv.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!statsMap[monthYear]) {
        statsMap[monthYear] = { revenue: 0, count: 0 };
      }
      
      const invTotal = inv.items?.reduce((sum, item) => sum + (item.quantity * item.rate), 0) || 0;
      statsMap[monthYear].revenue += invTotal;
      statsMap[monthYear].count += 1;
      totalRevenue += invTotal;
    });

    const statsArray = Object.keys(statsMap).map(month => ({
      month,
      revenue: statsMap[month].revenue,
      count: statsMap[month].count
    })).sort((a, b) => {
      return new Date(a.month) - new Date(b.month);
    });

    const maxRevenue = Math.max(...statsArray.map(s => s.revenue), 1);

    return { statsArray, totalRevenue, maxRevenue };
  };

  const { statsArray, totalRevenue, maxRevenue } = generateStats();

  return (
    <div>
      <h3 style={{ fontSize: '1.4rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        Invoice Statistics & Monthly Sales
      </h3>
      
      {statsArray.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          <BarChart3 size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
          <p>No invoice data available to generate statistics.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Total stats card */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Billings Accumulation</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 850, color: '#ef4444', marginTop: '0.25rem' }}>৳{totalRevenue.toLocaleString()}</div>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Average Monthly Sales</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 850, color: '#0f172a', marginTop: '0.25rem' }}>৳{Math.round(totalRevenue / statsArray.length).toLocaleString()}</div>
            </div>
          </div>

          {/* Horizontal Bar Chart representation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ color: '#334155', fontWeight: 600, fontSize: '1.1rem' }}>Month-over-Month Revenue Chart</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {statsArray.map((item, index) => {
                const pct = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '130px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>
                      {item.month}
                    </div>
                    
                    <div style={{ flex: 1, backgroundColor: '#f1f5f9', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${pct}%`,
                        backgroundColor: '#ef4444',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '0.75rem',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        minWidth: 'fit-content'
                      }}>
                        ৳{item.revenue.toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ width: '90px', color: '#64748b', fontSize: '0.85rem', textAlign: 'right' }}>
                      {item.count} invoice{item.count > 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default InvoiceStatsTab;
