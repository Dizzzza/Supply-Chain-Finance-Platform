import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Notifications from './pages/dashboard/Notifications';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Security from './pages/security/Security';

// Blockchain pages
import Transactions from './pages/blockchain/Transactions';
import Contracts from './pages/blockchain/Contracts';
import Wallet from './pages/blockchain/Wallet';

// Additional pages
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Terms from './pages/terms/Terms';
import Privacy from './pages/privacy/Privacy';

// Supplier pages
import Products from './pages/supplier/Products';
import Orders from './pages/supplier/Orders';
import Invoices from './pages/supplier/Invoices';
import Shipments from './pages/supplier/Shipments';

// Buyer pages
import BuyerOrders from './pages/buyer/Orders';
import BuyerInvoices from './pages/buyer/Invoices';
import BuyerShipments from './pages/buyer/Shipments';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="security" element={<Security />} />
              
              {/* Blockchain routes */}
              <Route path="blockchain/transactions" element={<Transactions />} />
              <Route path="blockchain/contracts" element={<Contracts />} />
              <Route path="blockchain/wallet" element={<Wallet />} />

              {/* Additional pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />

              {/* Supplier routes */}
              <Route path="supplier/products" element={<Products />} />
              <Route path="supplier/orders" element={<Orders />} />
              <Route path="supplier/invoices" element={<Invoices />} />
              <Route path="supplier/shipments" element={<Shipments />} />

              {/* Buyer routes */}
              <Route path="buyer/orders" element={<BuyerOrders />} />
              <Route path="buyer/invoices" element={<BuyerInvoices />} />
              <Route path="buyer/shipments" element={<BuyerShipments />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 