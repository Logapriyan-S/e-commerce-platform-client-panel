import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer'; // Added

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const getAuthHeader = () => {
    const accessToken = localStorage.getItem('access');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  };

  const fetchCartItemCount = useCallback(async () => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      setCartItemCount(0);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        headers: getAuthHeader(),
      });
      if (response.ok) {
        const data = await response.json();
        const count = data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartItemCount(count);
      } else if (response.status === 401) {
        setCartItemCount(0);
      } else {
        console.error("Failed to fetch cart count:", response.status);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  }, []);

  useEffect(() => {
    fetchCartItemCount();
  }, [fetchCartItemCount]);

  const toggleCart = () => setShowCart(prev => !prev);
  const handleSearchSubmit = (query: string) => navigate(`/products?search=${query}`);
  const onToggleCategories = () => navigate('/products');

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Navbar
        onToggleCategories={onToggleCategories}
        onToggleFilters={() => navigate('/products')}
        onToggleCart={toggleCart}
        cartItemCount={cartItemCount}
        onSearchSubmit={handleSearchSubmit}
      />
      {showCart && (
        <CartModal
          onClose={() => setShowCart(false)}
          onCartUpdate={fetchCartItemCount}
        />
      )}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Contact Us</h1>
          <p className="text-xl text-gray-600 mt-4">We would love to hear from you!</p>
          <div className="mt-8 max-w-xl mx-auto text-left space-y-4 text-lg text-gray-700">
            <div>
              <span className="font-semibold">Email:</span> contact@productzone.com
            </div>
            <div>
              <span className="font-semibold">Phone:</span> +91 9876543210
            </div>
            <div>
              <span className="font-semibold">Address:</span> 123, E-Commerce Street, Bengaluru, India
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;