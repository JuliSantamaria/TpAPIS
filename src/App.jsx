import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import GestionProductos from './pages/GestionProductos';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';
import './App.css';

function AppContent() {
  const { isCartOpen, closeCart } = useCart();

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