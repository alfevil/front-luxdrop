import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';

function Layout({ children, hideFooter = false }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111111',
                color: '#EFEFEF',
                border: '1px solid #1E1E1E',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                borderRadius: '0',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#080808' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#080808' } },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/catalog" element={<Layout><Catalog /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />

            <Route path="/cart" element={<Layout><ProtectedRoute><Cart /></ProtectedRoute></Layout>} />
            <Route path="/checkout" element={<Layout hideFooter><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
            <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
            <Route path="/orders" element={<Layout><ProtectedRoute><Orders /></ProtectedRoute></Layout>} />
            <Route path="/favorites" element={<Layout><ProtectedRoute><Favorites /></ProtectedRoute></Layout>} />

            <Route path="*" element={
              <Layout>
                <div className="min-h-screen flex items-center justify-center text-center">
                  <div>
                    <p className="font-display text-8xl text-zinc-800 mb-4">404</p>
                    <p className="text-zinc-500 mb-6">Страница не найдена</p>
                    <a href="/" className="btn-gold">На главную</a>
                  </div>
                </div>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
