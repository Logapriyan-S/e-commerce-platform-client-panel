import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import CartModal from '../components/CartModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer'; // Added

interface OrderItem {
  id: number;
  product: {
    name: string;
    image_url: string | null;
  };
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: number;
  user: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const getAuthHeader = () => {
    const accessToken = localStorage.getItem('access');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.error("Please log in to view your orders.");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/orders/', {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try again later.");
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
    fetchOrders();
    fetchCartItemCount();
  }, [fetchOrders, fetchCartItemCount]);

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
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Orders</h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <p className="text-center text-red-600 text-xl py-10">{error}</p>
          ) : orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                      <p className="text-sm text-gray-500">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">Total: ₹{parseFloat(order.total_price as any).toFixed(2)}</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center">
                        <img
                          src={item.product.image_url || `https://placehold.co/80x80/cccccc/333333?text=Product`}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{item.product.name}</h3>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-gray-700">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-2xl font-bold text-gray-800">No Orders Found</p>
              <p className="text-gray-600 mt-2">Looks like you haven't placed any orders yet. Start shopping now!</p>
              <button
                onClick={() => navigate('/products')}
                className="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;