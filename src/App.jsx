import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import GestionProductos from './pages/GestionProductos';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';
import './App.css';



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/gestion-productos" element={<GestionProductos />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/categoria/:nombre" element={<CategoryPage />} />
            

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;