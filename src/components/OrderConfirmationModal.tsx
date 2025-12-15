import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import { apiFetch } from '../utils/api';
import CustomToast from './CustomToast'; // <-- Ensure this is imported

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

interface OrderConfirmationModalProps {
  cart: Cart;
  onClose: () => void;
  onOrderPlaced: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ cart, onClose, onOrderPlaced }) => {
  const [loading, setLoading] = useState(false);
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('orders/create_order/', {
        method: 'POST',
        body: JSON.stringify({ deliveryEmail, deliveryAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // CORRECTED: Use CustomToast for the success message
      toast.success(<CustomToast title="Order Placed!" message="Thank you for your purchase. Your order is being processed." icon="check" />, { position: 'top-center' });
      onOrderPlaced();
    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error(`Failed to place order: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] font-inter">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Confirmation</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Order Summary</h3>
          {cart.items.map(item => (
            <div key={item.id} className="flex items-center">
              <img
                src={item.product.image_url || `https://placehold.co/60x60/cccccc/333333?text=Product`}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{item.product.name}</h4>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
              </div>
              <span className="font-bold text-gray-700">₹{parseFloat(item.product.price as string).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 mt-6 flex justify-between items-center text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span>₹{parseFloat(cart.total_cart_price).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="deliveryEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="deliveryEmail"
                value={deliveryEmail}
                onChange={(e) => setDeliveryEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter your delivery address"
                required
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !deliveryEmail || !deliveryAddress}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors font-semibold disabled:bg-green-400"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;