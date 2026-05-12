import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import MotionSystem from './components/common/MotionSystem'
import ProtectedRoute from './components/common/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/AdminDashboard'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

function App() {
  const location = useLocation();

  return (
    <HelmetProvider>
      <div className="app-shell min-h-screen text-black">
        <ScrollToTop />
        <MotionSystem />
        <Navbar />

        <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 lg:px-8">
          <LayoutGroup id="ishoes-layouts">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.985 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </LayoutGroup>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default App
