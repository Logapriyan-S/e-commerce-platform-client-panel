import React, { useState } from 'react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number | string;
    image_url: string | null;
    description: string;
  };
  onAddToCart: (productId: number, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCartClick = () => {
    onAddToCart(product.id, quantity);
    setQuantity(1);
  };

  const price = parseFloat(product.price as string);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl font-inter">
      <img
        src={product.image_url || `https://placehold.co/400x300/cccccc/333333?text=No+Image`}
        alt={product.name}
        className="w-full h-60 object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://placehold.co/400x300/cccccc/333333?text=No+Image`;
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-1">Category: {product.category}</p>
        <p className="text-gray-700 text-lg font-bold mb-3">₹{price.toFixed(2)}</p>
        <p className="text-gray-500 text-sm line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <label htmlFor={`quantity-${product.id}`} className="sr-only">Quantity</label>
          <input
            type="number"
            id={`quantity-${product.id}`}
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center text-gray-700"
          />
          <button
            onClick={handleAddToCartClick}
            className="flex-1 ml-4 bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
