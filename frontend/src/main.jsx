import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { NotificationProvider } from './context/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <BrowserRouter>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '16px',
                    fontWeight: 600,
                    fontSize: '14px',
                  },
                }}
              />
            </BrowserRouter>
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
