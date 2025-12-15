import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import CartModal from '../components/CartModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image_url: string | null;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [showCart, setShowCart] = useState<boolean>(false);

  const getAuthHeader = () => {
    const accessToken = localStorage.getItem('access');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
  };

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}/`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Product = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Failed to load product details.");
      toast.error("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

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
    fetchProduct();
    fetchCartItemCount();
  }, [fetchProduct, fetchCartItemCount]);

  const handleAddToCart = async () => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ product_id: product?.id, quantity: quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast.success(`${quantity}x ${product?.name} added to cart!`);
      fetchCartItemCount();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error(`Failed to add item to cart: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleCart = () => setShowCart(prev => !prev);
  const handleSearchSubmit = (query: string) => navigate(`/products?search=${query}`);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
        <Navbar cartItemCount={cartItemCount} onToggleCart={toggleCart} onSearchSubmit={handleSearchSubmit} onToggleCategories={() => navigate('/products')} onToggleFilters={() => navigate('/products')} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
        <Navbar cartItemCount={cartItemCount} onToggleCart={toggleCart} onSearchSubmit={handleSearchSubmit} onToggleCategories={() => navigate('/products')} onToggleFilters={() => navigate('/products')} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-center text-red-600 text-xl py-10">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
        <Navbar cartItemCount={cartItemCount} onToggleCart={toggleCart} onSearchSubmit={handleSearchSubmit} onToggleCategories={() => navigate('/products')} onToggleFilters={() => navigate('/products')} />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-center text-gray-600 text-xl py-10">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const price = parseFloat(product.price as string);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      <Navbar cartItemCount={cartItemCount} onToggleCart={toggleCart} onSearchSubmit={handleSearchSubmit} onToggleCategories={() => navigate('/products')} onToggleFilters={() => navigate('/products')} />
      {showCart && (
        <CartModal onClose={() => setShowCart(false)} onCartUpdate={fetchCartItemCount} />
      )}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          <div className="md:w-1/2">
            <img 
              src={product.image_url || `https://placehold.co/600x600/cccccc/333333?text=No+Image`} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-xl text-gray-500 mt-2">Category: {product.category_name}</p>
              <p className="text-2xl font-bold text-cyan-600 mt-4">₹{price.toFixed(2)}</p>
              <p className="text-lg text-gray-700 mt-4">{product.description}</p>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <label htmlFor="quantity" className="text-lg font-semibold">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-gray-700"
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-semibold"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;