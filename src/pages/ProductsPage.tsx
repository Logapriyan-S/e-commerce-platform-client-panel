import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Categories from '../components/Categories';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import PriceRangeFilter from '../components/PriceRangeFilter';
import SortByDropdown from '../components/SortByDropdown';
import { apiFetch } from '../utils/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  image_url: string | null;
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCart, setShowCart] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const fetchProducts = useCallback(
    async (
      category: string | null = null,
      search: string = '',
      min_price: number = 0,
      max_price: number = 100000,
      ordering: string = ''
    ) => {
      setLoadingProducts(true);
      setProductsError(null);
      let url = 'products/';
      const params = new URLSearchParams();

      if (category) {
        params.append('category__name', category);
      }
      if (search) {
        params.append('search', search);
      }
      params.append('min_price', min_price.toString());
      params.append('max_price', max_price.toString());
      if (ordering) {
        params.append('ordering', ordering);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await apiFetch(url, {});
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProductsError('Failed to load products. Please try again later.');
        toast.error('Failed to load products.');
      } finally {
        setLoadingProducts(false);
      }
    },
    []
  );

  const fetchCartItemCount = useCallback(async () => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      setCartItemCount(0);
      return;
    }
    try {
      const response = await apiFetch('cart/', {});
      if (response.ok) {
        const data = await response.json();
        const count = data.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartItemCount(count);
      } else if (response.status === 401) {
        setCartItemCount(0);
      } else {
        console.error('Failed to fetch cart count:', response.status);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    fetchProducts(categoryParam, searchParam, minPrice, maxPrice, sortBy);
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      fetchCartItemCount();
    }
  }, [fetchProducts, fetchCartItemCount, location.search, minPrice, maxPrice, sortBy]);

  const handleAddToCart = async (productId: number, quantity: number) => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await apiFetch('cart/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast.success(`${quantity}x item(s) added to cart!`);
      fetchCartItemCount();
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error(
        `Failed to add item to cart: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  };

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    navigate(`/products?search=${query}`);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchQuery('');
    navigate(`/products?category=${categoryName}`);
  };

  const handlePriceFilter = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleSortBy = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Navbar
        onToggleCategories={() => {}}
        onToggleFilters={() => {}}
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
          <Categories onCategorySelect={handleCategorySelect} />

          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory
                ? `Products in ${selectedCategory}`
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : 'All Products'}
            </h2>
            <div className="flex items-center space-x-4">
              <PriceRangeFilter
                onApply={handlePriceFilter}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
              <SortByDropdown onSelect={handleSortBy} currentSort={sortBy} />
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : productsError ? (
            <p className="text-center text-red-600 text-xl py-10">
              {productsError}
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-xl py-10">
              No products found for this selection.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
