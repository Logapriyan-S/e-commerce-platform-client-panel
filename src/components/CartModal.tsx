import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import CustomToast from './CustomToast';

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

interface CartModalProps {
  onClose: () => void;
  onCartUpdate: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose, onCartUpdate }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => {
    const accessToken = localStorage.getItem('access');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          onClose();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Cart = await response.json();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart. Please try again.");
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
      const response = await fetch('http://localhost:8000/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          product_id: itemToUpdate.product.id,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart();
      onCartUpdate();
      toast.success(<CustomToast title="Cart Updated!" message="Item quantity has been changed." icon="cart" />, { position: 'top-center' });
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
      const response = await fetch(`http://localhost:8000/api/cart/${itemId}/`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart();
      onCartUpdate();
      toast.success(<CustomToast title="Item Removed" message="The item has been removed from your cart." />, { position: 'top-center' });
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      toast.error("Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
          <p className="text-center text-red-600">{error}</p>
          <button onClick={onClose} className="mt-4 w-full bg-gray-200 py-2 rounded-md">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Cart</h2>

        {cart && cart.items.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0">
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
            <div className="border-t pt-4 mt-6 flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total:</span>
              <span>₹{parseFloat(cart.total_cart_price).toFixed(2)}</span>
            </div>
            <button
              onClick={() => { toast.info('Checkout functionality coming soon!'); }}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-semibold"
            >
              Proceed to Order
            </button>
          </>
        ) : (
          <p className="text-center text-gray-600 text-lg py-8">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default CartModal;