import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartModal from '../components/CartModal';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const getAuthHeader = () => {
    const accessToken = localStorage.getItem('access');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
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
      } else {
        setCartItemCount(0);
      }
    } catch (err) {
      console.error("Cart fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchCartItemCount();
  }, [fetchCartItemCount]);

  const toggleCart = () => setShowCart(prev => !prev);
  const handleSearchSubmit = (query: string) => navigate(`/products?search=${query}`);
  const onToggleCategories = () => navigate('/products');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
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

      <main className="flex-1 py-12 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-6">About Our Store</h1>
              <p className="text-lg text-gray-600 mb-4">
                At ProductZone, we believe shopping should be simple, enjoyable, and secure.
                Our mission is to provide high-quality products with exceptional customer service.
              </p>
              <p className="text-gray-600 mb-4">
                We cater to a wide range of needs — from everyday essentials to unique specialty items.
                Backed by a passionate team and strong values, we aim to deliver excellence in everything we do.
              </p>
              <p className="text-gray-600">
                Thank you for being a part of our journey. We’re excited to serve you!
              </p>
            </div>

            {/* Right Image */}
            <div className="w-full flex justify-center">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/ecommerce-4473873-3723124.png"
                alt="About illustration"
                className="w-full max-w-md"
              />
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Fast Delivery",
                  desc: "We make sure your products reach you quickly and safely.",
                  icon: "🚚",
                },
                {
                  title: "Best Quality",
                  desc: "Only top-rated and thoroughly checked items in every category.",
                  icon: "🌟",
                },
                {
                  title: "24/7 Support",
                  desc: "Need help? Our friendly team is here round the clock.",
                  icon: "💬",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition duration-300"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
