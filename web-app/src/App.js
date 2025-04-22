import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

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
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Защищенные маршруты */}
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="dashboard/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="security" element={
                  <ProtectedRoute>
                    <Security />
                  </ProtectedRoute>
                } />
                
                {/* Blockchain routes */}
                <Route path="blockchain/transactions" element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } />
                <Route path="blockchain/contracts" element={
                  <ProtectedRoute>
                    <Contracts />
                  </ProtectedRoute>
                } />
                <Route path="blockchain/wallet" element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                } />

                {/* Additional pages */}
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />

                {/* Supplier routes */}
                <Route path="supplier/products" element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } />
                <Route path="supplier/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="supplier/invoices" element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="supplier/shipments" element={
                  <ProtectedRoute>
                    <Shipments />
                  </ProtectedRoute>
                } />

                {/* Buyer routes */}
                <Route path="buyer/orders" element={
                  <ProtectedRoute>
                    <BuyerOrders />
                  </ProtectedRoute>
                } />
                <Route path="buyer/invoices" element={
                  <ProtectedRoute>
                    <BuyerInvoices />
                  </ProtectedRoute>
                } />
                <Route path="buyer/shipments" element={
                  <ProtectedRoute>
                    <BuyerShipments />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 