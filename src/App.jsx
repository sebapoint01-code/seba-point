import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServiceDetailPage from './components/ServiceDetailPage';
import AdminLogin from './components/AdminLogin';
import OwnerLogin from './components/OwnerLogin';
import AdminPanel from './components/AdminPanel';
import OwnerPanel from './components/OwnerPanel';
import SliderLogoCMS from './components/SliderLogoCMS';
import PagesCMS from './components/PagesCMS';
import ServicesCMS from './components/ServicesCMS';
import SeoCMS from './components/SeoCMS';
import BillingPortalTab from './components/BillingPortalTab';
import InvoiceStatsTab from './components/InvoiceStatsTab';
import EmployeeManagementTab from './components/EmployeeManagementTab';
import InvoiceHistory from './components/InvoiceHistory';
import InvoiceForm from './components/InvoiceForm';
import { Wifi, WifiOff } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

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
      const pathname = location.pathname;
      let pageKey = 'homepage';
      if (pathname.includes('/about')) pageKey = 'about';
      if (pathname.includes('/contact')) pageKey = 'contact';
      
      const seoData = settings.seo[pageKey];
      if (seoData) {
        document.title = seoData.title || settings.siteName || 'SebaPoint';
        
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = seoData.description || 'SebaPoint Portal';
      }
    }
  }, [location.pathname, settings]);

  // Authenticate Success
  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('seba_token', newToken);
    localStorage.setItem('seba_user', JSON.stringify(newUser));
    localStorage.removeItem('seba_logged_out');
    setToken(newToken);
    setUser(newUser);
    
    // Redirect to correct dashboard
    if (newUser.role === 'owner') {
      navigate('/owner-panel');
    } else {
      navigate('/admin-panel');
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
    navigate('/home');
  };

  // Handle opening an invoice for editing
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    navigate('/owner-panel/invoices/edit');
  };

  // Handle successful save/create/update of an invoice
  const handleInvoiceSaved = () => {
    fetchInvoices();
    navigate('/owner-panel/invoices');
  };

  // Revenue calculation
  const totalRevenue = invoices.reduce((sum, inv) => {
    const invTotal = inv.items?.reduce((s, item) => s + (item.quantity * item.rate), 0) || 0;
    return sum + invTotal;
  }, 0);

  // Authentication Guards
  const AdminRoute = () => {
    const currentToken = token || localStorage.getItem('seba_token');
    const currentUser = user || JSON.parse(localStorage.getItem('seba_user') || 'null');
    if (!currentToken || (currentUser?.role !== 'admin' && currentUser?.role !== 'owner')) {
      return <Navigate to="/adminlogin" replace />;
    }
    return <Outlet />;
  };

  const OwnerRoute = () => {
    const currentToken = token || localStorage.getItem('seba_token');
    const currentUser = user || JSON.parse(localStorage.getItem('seba_user') || 'null');
    if (!currentToken || currentUser?.role !== 'owner') {
      return <Navigate to="/ownerlogin" replace />;
    }
    return <Outlet />;
  };

  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={
        <div className="seba-site-container">
          <Navbar settings={settings} />
          <main style={{ minHeight: '80vh' }}>
            <Outlet />
          </main>
          <Footer settings={settings} />
        </div>
      }>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Homepage settings={settings} services={services} />} />
        <Route path="/about" element={<AboutPage settings={settings} />} />
        <Route path="/contact" element={<ContactPage settings={settings} />} />
        <Route path="/product/:id" element={<ServiceDetailPage services={services} settings={settings} />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/adminlogin" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/ownerlogin" element={<OwnerLogin onLoginSuccess={handleLoginSuccess} />} />

      {/* Admin Panel (CMS) nested paths */}
      <Route path="/admin-panel" element={<AdminRoute />}>
        <Route element={<AdminPanel token={token} user={user} onLogout={handleLogout} settings={settings} />}>
          <Route index element={<SliderLogoCMS token={token} onRefreshConfig={fetchSettings} />} />
          <Route path="pages" element={<PagesCMS token={token} onRefreshConfig={fetchSettings} />} />
          <Route path="services" element={<ServicesCMS token={token} />} />
        </Route>
      </Route>

      {/* Dedicated standalone SEO CMS Page */}
      <Route path="/seo-headers-cms" element={<AdminRoute />}>
        <Route index element={<SeoCMS token={token} user={user} onLogout={handleLogout} />} />
      </Route>

      {/* Owner Panel (Executive Dashboard & Billing) nested paths */}
      <Route path="/owner-panel" element={<OwnerRoute />}>
        <Route element={
          <div className="owner-layout-wrapper">
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
                fontWeight: 500,
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 2000,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <WifiOff size={18} />
                <span>{errorMessage}</span>
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
            <OwnerPanel user={user} onLogout={handleLogout} settings={settings} />
          </div>
        }>
          <Route index element={<BillingPortalTab invoices={invoices} totalRevenue={totalRevenue} onEditInvoice={handleEditInvoice} onRefresh={fetchInvoices} />} />
          <Route path="stats" element={<InvoiceStatsTab invoices={invoices} />} />
          <Route path="employees" element={<EmployeeManagementTab token={token} />} />
          <Route path="invoices" element={<InvoiceHistory invoices={invoices} onEditInvoice={handleEditInvoice} onRefresh={fetchInvoices} />} />
          <Route path="invoices/new" element={<InvoiceForm invoice={null} onSave={handleInvoiceSaved} onCancel={() => navigate('/owner-panel')} invoices={invoices} settings={settings} />} />
          <Route path="invoices/edit" element={<InvoiceForm invoice={selectedInvoice} onSave={handleInvoiceSaved} onCancel={() => navigate('/owner-panel')} invoices={invoices} settings={settings} />} />
          <Route path="cms" element={<Navigate to="/admin-panel" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
