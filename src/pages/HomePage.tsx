import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartModal from '../components/CartModal';
import ImageSlider from '../components/ImageSlider';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const sliderImages = [
  { src: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/5fe58161a15765f1.jpeg?q=60', alt: 'Electronics Deals' },
  { src: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/f2ffab1767893241.jpg?q=60', alt: 'Fashion Sale' },
  { src: 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1c4126ea921e5994.jpeg?q=60', alt: 'Home & Kitchen' },
];

const HomePage: React.FC = () => {
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
        <div className="container mx-auto px-4 py-8">
          <ImageSlider images={sliderImages} />
          
          {/* CORRECTED: The welcome message and button are now on the same line using flexbox */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-800">Welcome to ProductZone!</h1>
              <p className="text-xl text-gray-600 mt-2">Discover the best products and start shopping.</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 md:mt-0 px-6 py-3 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;