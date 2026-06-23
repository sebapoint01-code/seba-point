import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoiceHistory from './components/InvoiceHistory';
import AuthPanel from './components/AuthPanel';
import AdminPanel from './components/AdminPanel';
import OwnerPanel from './components/OwnerPanel';
import { Wifi, WifiOff } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    let hash = window.location.hash.replace('#', '');
    if (hash === 'AdminLogin') hash = 'admin-login';
    if (hash === 'OwnerLogin') hash = 'owner-login';
    if (hash.startsWith('service-detail-')) return 'service-detail';
    const validViews = ['homepage', 'about', 'contact', 'admin-login', 'owner-login', 'admin-panel', 'owner-panel', 'dashboard', 'editor', 'history'];
    return validViews.includes(hash) ? hash : 'homepage';
  });

  const [selectedServiceId, setSelectedServiceId] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('service-detail-')) {
      return hash.replace('service-detail-', '');
    }
    return null;
  });

  // CMS & Auth State
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('seba_token') || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('seba_user') || 'null');
    } catch {
      return null;
    }
  });

  // Invoice Billing State
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Invoice object for editing
  const [dbState, setDbState] = useState('connecting'); // 'connecting', 'connected', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Website Config
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      if (response.ok) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch website settings:', err);
    }
  };

  // Fetch Services List
  const fetchServices = async () => {
    try {
      const url = token ? '/api/services/all' : '/api/services';
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(url, { headers });
      const data = await response.json();
      if (response.ok) {
        setServices(data);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  // Fetch Invoices
  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInvoices(data);
      setDbState('connected');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      setDbState('error');
      setErrorMessage('Could not connect to MongoDB backend. Running in offline/demo mode.');
    }
  };

  // Initial Data Load
  useEffect(() => {
    // Development auto-login bypass (only on localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const loggedOut = localStorage.getItem('seba_logged_out');
      if (!localStorage.getItem('seba_token') && !loggedOut) {
        localStorage.setItem('seba_token', 'dev-bypass-token');
        localStorage.setItem('seba_user', JSON.stringify({ email: 'owner@sebapoint.com', role: 'owner' }));
        setToken('dev-bypass-token');
        setUser({ email: 'owner@sebapoint.com', role: 'owner' });
      }
    }
    fetchSettings();
    fetchInvoices();
  }, []);

  // Fetch services when token changes (enables admin/owner paused cards)
  useEffect(() => {
    fetchServices();
  }, [token]);

  // Sync browser title and meta description with SEO settings
  useEffect(() => {
    if (settings?.seo) {
      const pageKey = ['homepage', 'about', 'contact'].includes(currentView) ? currentView : 'homepage';
      const seoData = settings.seo[pageKey];
      if (seoData) {
        document.title = seoData.title || settings.siteName || 'SebaPoint';
        
        // Update meta description dynamically if exists
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = seoData.description || 'SebaPoint Portal';
      }
    }
  }, [currentView, settings]);

  // Sync hash changes from browser (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '');
      if (hash === 'AdminLogin') hash = 'admin-login';
      if (hash === 'OwnerLogin') hash = 'owner-login';
      if (hash.startsWith('service-detail-')) {
        setSelectedServiceId(hash.replace('service-detail-', ''));
        setCurrentView('service-detail');
      } else {
        const validViews = ['homepage', 'about', 'contact', 'admin-login', 'owner-login', 'admin-panel', 'owner-panel', 'dashboard', 'editor', 'history'];
        if (validViews.includes(hash)) {
          setCurrentView(hash);
        } else if (!hash) {
          setCurrentView('homepage');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when view changes
  useEffect(() => {
    if (currentView === 'service-detail' && selectedServiceId) {
      window.history.replaceState(null, '', `#service-detail-${selectedServiceId}`);
    } else if (currentView === 'admin-login') {
      window.history.replaceState(null, '', '#AdminLogin');
    } else if (currentView === 'owner-login') {
      window.history.replaceState(null, '', '#OwnerLogin');
    } else {
      window.history.replaceState(null, '', `#${currentView}`);
    }
  }, [currentView, selectedServiceId]);

  // Authenticate Success
  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('seba_token', newToken);
    localStorage.setItem('seba_user', JSON.stringify(newUser));
    localStorage.removeItem('seba_logged_out');
    setToken(newToken);
    setUser(newUser);
    
    // Redirect to correct dashboard
    if (newUser.role === 'owner') {
      setCurrentView('owner-panel');
    } else {
      setCurrentView('admin-panel');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('seba_token');
    localStorage.removeItem('seba_user');
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      localStorage.setItem('seba_logged_out', 'true');
    }
    setToken(null);
    setUser(null);
    setCurrentView('homepage');
  };

  // Switching views
  const handleNavigate = (view) => {
    // Authentication Route Guards
    if (view === 'admin-panel' && (!token || (user?.role !== 'admin' && user?.role !== 'owner'))) {
      setCurrentView('admin-login');
      return;
    }
    if (view === 'owner-panel' && (!token || user?.role !== 'owner')) {
      setCurrentView('owner-login');
      return;
    }
    if (['dashboard', 'editor', 'history'].includes(view) && (!token || user?.role !== 'owner')) {
      setCurrentView('owner-login');
      return;
    }

    setCurrentView(view);
    if (view !== 'editor') {
      setSelectedInvoice(null);
    }
  };

  // Handle starting a new invoice
  const handleCreateNewInvoice = () => {
    setSelectedInvoice(null);
    setCurrentView('editor');
  };

  // Handle opening an invoice for editing
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('editor');
  };

  // Handle successful save/create/update of an invoice
  const handleInvoiceSaved = () => {
    fetchInvoices();
    setCurrentView('history');
  };

  // Public Layout Routing
  const isSebaPointSite = ['homepage', 'about', 'contact', 'service-detail'].includes(currentView);

  if (isSebaPointSite) {
    return (
      <div className="seba-site-container">
        <Navbar currentView={currentView} onNavigate={handleNavigate} settings={settings} />
        <main>
          {currentView === 'homepage' && (
            <Homepage 
              onSelectService={(serviceId) => {
                setSelectedServiceId(serviceId);
                handleNavigate('service-detail');
              }} 
              onNavigate={handleNavigate}
              settings={settings}
              services={services}
            />
          )}
          {currentView === 'about' && <AboutPage settings={settings} />}
          {currentView === 'contact' && <ContactPage settings={settings} />}
          {currentView === 'service-detail' && (
            <ServiceDetailPage 
              serviceId={selectedServiceId} 
              onNavigate={handleNavigate}
              services={services}
            />
          )}
        </main>
        <Footer onNavigate={handleNavigate} settings={settings} />
      </div>
    );
  }

  // Admin/Owner Login Panels
  if (currentView === 'admin-login') {
    return <AuthPanel role="admin" onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
  }
  if (currentView === 'owner-login') {
    return <AuthPanel role="owner" onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
  }

  // Admin CMS panel
  if (currentView === 'admin-panel') {
    return (
      <AdminPanel 
        token={token} 
        user={user} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        initialConfig={settings}
        initialServices={services}
        onRefreshConfig={fetchSettings}
        onRefreshServices={fetchServices}
      />
    );
  }

  // Owner Panel
  if (currentView === 'owner-panel') {
    return (
      <OwnerPanel 
        token={token} 
        user={user} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        initialConfig={settings}
        initialServices={services}
        onRefreshConfig={fetchSettings}
        onRefreshServices={fetchServices}
        // Billing Props
        invoices={invoices}
        dbState={dbState}
        onRefreshInvoices={fetchInvoices}
        onEditInvoice={handleEditInvoice}
        onCreateInvoice={handleCreateNewInvoice}
      />
    );
  }

  // Fallback / Invoicing Layouts (Managed Inside Owner Panel Tabs now, but also fallback support)
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onCreateInvoice={handleCreateNewInvoice} 
        onLogout={handleLogout}
      />

      {/* Main Body Area */}
      <div className="main-content">
        
        {/* DB Status Banner */}
        {dbState === 'error' && (
          <div className="no-print" style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            color: '#ef4444',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 500
          }}>
            <WifiOff size={18} />
            <span>{errorMessage} (Check MONGODB_URI in Vercel env settings)</span>
          </div>
        )}
        
        {dbState === 'connected' && (
          <div className="no-print" style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #dcfce7',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            zIndex: 1000
          }}>
            <Wifi size={14} />
            <span>Database Live</span>
          </div>
        )}

        {/* View Router */}
        {currentView === 'dashboard' && (
          <Dashboard 
            invoices={invoices} 
            onCreateInvoice={handleCreateNewInvoice}
            onEditInvoice={handleEditInvoice}
            dbState={dbState}
          />
        )}

        {currentView === 'editor' && (
          <InvoiceForm 
            invoice={selectedInvoice} 
            onSave={handleInvoiceSaved}
            onCancel={() => handleNavigate('owner-panel')}
            invoices={invoices}
          />
        )}

        {currentView === 'history' && (
          <InvoiceHistory 
            invoices={invoices} 
            onEditInvoice={handleEditInvoice}
            onRefresh={fetchInvoices}
          />
        )}
      </div>
    </div>
  );
}

export default App;
