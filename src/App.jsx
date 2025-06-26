import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { CartProvider, useCart } from './features/cart/context/CartContext';
import Navbar from './shared/components/Navbar';
import CartSidebar from './features/cart/components/CartSidebar';
import { useAxiosAuthInterceptor } from './features/auth/useAxiosAuthInterceptor';

import Home from './pages/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProductDetail from './features/products/ProductDetail';
import GestionProductos from './features/products/GestionProductos';
import Profile from './features/profile/Profile';
import CategoryPage from './features/products/CategoryPage';
import './App.css';

function AppContent() {
  const { isCartOpen, closeCart } = useCart();
  useAxiosAuthInterceptor(); // <-- Agrega el interceptor que ejecuta logout

  return (
    <>
      <Navbar />
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/gestion-productos" element={<GestionProductos />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/categoria/:nombre" element={<CategoryPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;