import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import HomePage         from './pages/HomePage';
import ShopPage         from './pages/ShopPage';
import ProductPage      from './pages/ProductPage';
import CartPage         from './pages/CartPage';
import CheckoutPage     from './pages/CheckoutPage';
import OrdersPage       from './pages/OrdersPage';
import LoginPage        from './pages/LoginPage';
import AboutPage        from './pages/AboutPage';
import ContactPage      from './pages/ContactPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

import AdminLayout      from './pages/admin/AdminLayout';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminProducts    from './pages/admin/AdminProducts';
import AdminCategories  from './pages/admin/AdminCategories';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminUsers       from './pages/admin/AdminUsers';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/"                   element={<HomePage />} />
              <Route path="/shop"               element={<ShopPage />} />
              <Route path="/shop/:categorySlug" element={<ShopPage />} />
              <Route path="/product/:id"        element={<ProductPage />} />
              <Route path="/cart"               element={<CartPage />} />
              <Route path="/about"              element={<AboutPage />} />
              <Route path="/contact"            element={<ContactPage />} />
              <Route path="/login"              element={<LoginPage />} />
              <Route path="/register"           element={<LoginPage />} />
              <Route path="/auth/callback"      element={<AuthCallbackPage />} />

              {/* Protected */}
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders"   element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index             element={<AdminDashboard />} />
                <Route path="products"   element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders"     element={<AdminOrders />} />
                <Route path="users"      element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
