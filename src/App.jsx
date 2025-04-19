import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import CategoryPage from "./pages/CategoryPage";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/categoria/:nombre" element={<CategoryPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;