import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/api';

interface NavbarProps {
  onToggleCategories: () => void;
  onToggleFilters: () => void;
  onToggleCart: () => void;
  cartItemCount: number;
  onSearchSubmit: (query: string) => void;
}

interface ProductSuggestion {
  id: number;
  name: string;
  image_url: string | null;
  category_name: string;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleCart, cartItemCount, onSearchSubmit }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await apiFetch(`products/search-suggestions/?q=${searchQuery}`, {});
        if (response.ok) {
          const data: ProductSuggestion[] = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          console.error("Failed to fetch search suggestions:", response.status);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-inter">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-cyan-600">
          ProductZone
        </Link>

        <div className="relative flex-1 mx-8 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded-r-md hover:bg-cyan-700 transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 max-h-96 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 border-b border-gray-200"
                  onClick={() => handleSuggestionClick(suggestion.id)}
                >
                  <img
                    src={suggestion.image_url || `https://placehold.co/40x40/cccccc/333333?text=N/A`}
                    alt={suggestion.name}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{suggestion.name}</p>
                    <p className="text-xs text-gray-500">in {suggestion.category_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="flex items-center space-x-4 ml-8">
          <button onClick={() => navigate('/cart')} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;