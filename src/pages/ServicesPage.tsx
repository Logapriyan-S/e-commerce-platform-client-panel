import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';

const ServicesPage: React.FC = () => {
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
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Our Services</h1>
          <p className="text-lg text-gray-600 mb-10">
            We offer a wide range of services to our valued customers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm text-center">
                Get your products quickly with our efficient and reliable delivery network.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <div className="text-5xl mb-4">🔁</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm text-center">
                Hassle-free return and exchange process for your convenience.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <div className="text-5xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm text-center">
                Our customer support team is always here to help you, anytime.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm text-center">
                We ensure safe and encrypted payment options for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
