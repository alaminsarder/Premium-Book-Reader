import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Membership from './pages/Membership';
import Checkout from './pages/Checkout';
import Notice from './pages/Notice'; // নিশ্চিত করুন এই ফাইলটি src/pages/ এ আছে

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/notice" element={<Notice />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;