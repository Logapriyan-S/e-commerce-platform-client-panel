import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { apiFetch } from '../utils/api';
import OrderConfirmationModal from '../components/OrderConfirmationModal'; // Make sure this is imported

interface ProductInCart {
  id: number;
  name: string;
  price: number | string;
  image_url: string | null;
}

interface CartItem {
  id: number;
  product: ProductInCart;
  quantity: number;
}

interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_cart_price: string;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false); // State to show/hide the modal

  const fetchCartAndCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.error('Please log in to view your cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await apiFetch('cart/', {});
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Cart = await response.json();
      setCart(data);
      const count = data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartItemCount(count);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart. Please try again.");
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartAndCount();
  }, [fetchCartAndCount]);
  
  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      const itemToUpdate = cart?.items.find(item => item.id === itemId);
      if (!itemToUpdate) {
        toast.error('Item not found in cart.');
        setLoading(false);
        return;
      }
      const response = await apiFetch('cart/', {
        method: 'POST',
        body: JSON.stringify({
          product_id: itemToUpdate.product.id,
          quantity: newQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCartAndCount();
      toast.success('Cart updated successfully!');
    } catch (err) {
      console.error("Failed to update cart item quantity:", err);
      toast.error("Failed to update quantity.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setLoading(true);
    try {
      const response = await apiFetch(`cart/${itemId}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCartAndCount();
      toast.success('Item removed from cart!');
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      toast.error("Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (query: string) => navigate(`/products?search=${query}`);
  const onToggleCategories = () => navigate('/products');
  const onToggleFilters = () => navigate('/products');

  const handleProceedToOrder = () => {
    setShowOrderConfirmation(true); // CORRECTED: This now opens the modal
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Navbar
        onToggleCategories={onToggleCategories}
        onToggleFilters={onToggleFilters}
        onToggleCart={() => navigate('/cart')}
        cartItemCount={cartItemCount}
        onSearchSubmit={handleSearchSubmit}
      />
      {showOrderConfirmation && cart && (
        <OrderConfirmationModal
          cart={cart}
          onClose={() => setShowOrderConfirmation(false)}
          onOrderPlaced={() => {
            setShowOrderConfirmation(false);
            fetchCartAndCount(); // Refresh the cart after order is placed
            navigate('/orders'); // Navigate to the orders page
          }}
        />
      )}
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Cart</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-xl py-10">{error}</p>
        ) : cart && cart.items.length > 0 ? (
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-3/4 space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg p-4 flex items-center">
                  <img
                    src={item.product.image_url || `https://placehold.co/80x80/cccccc/333333?text=Product`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{item.product.name}</h3>
                    <p className="text-gray-600">₹{parseFloat(item.product.price as string).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:w-1/4 mt-8 md:mt-0 bg-white rounded-lg shadow-lg p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Order Summary</h2>
              <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                <span>Total:</span>
                <span>₹{parseFloat(cart.total_cart_price).toFixed(2)}</span>
              </div>
              <button
                onClick={handleProceedToOrder}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-semibold"
              >
                Proceed to Order
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-2xl font-bold text-gray-800">Your cart is empty.</p>
            <p className="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet. Start shopping now!</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-md font-semibold hover:bg-cyan-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;