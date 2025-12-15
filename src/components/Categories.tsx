import React, { useState } from 'react';

interface CategoryItem {
  name: string;
  image: string;
}

interface CategoriesProps {
  onCategorySelect?: (categoryName: string) => void;
  onClose?: () => void;
}

const allCategories: CategoryItem[] = [
  { name: 'Mobiles & Tablets', image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/m/o/b/-original-imaghx9qkugtbfrn.jpeg?q=70' },
  { name: 'Fashion', image: 'https://m.media-amazon.com/images/I/610IIi6wHuL._AC_UL480_FMwebp_QL65_.jpg' },
  { name: 'Electronics', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/fan/m/y/i/2134841511010-32-1-ceiling-fan-1200-orient-electric-original-imah5tgnebwv8tjc.jpeg?q=70' },
  { name: 'Home & Furniture', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bed/y/d/7/king-213-36-na-no-190-5-rosewood-sheesham-yes-120-gorav-ha59-original-imah77mnzrfehggv.jpeg?q=70' },
  { name: 'TVs & Appliances', image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/television/p/7/x/-original-imahcyc4gafga3jf.jpeg?q=70' },
  { name: 'Grocery', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/nut-dry-fruit/m/c/b/450-100-natural-premium-whole-value-pack-1-pouch-happilo-original-imah9deykhv6hvfa.jpeg?q=70' }, // Placeholder used as a direct image URL was not provided
  { name: 'Toys', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/stuffed-toy/l/z/t/teddy-bear-3-feet-panda-soft-toy-birthday-gift-for-girls-wife-90-original-imah9ywyt4paje22.jpeg?q=70' },
];

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  return (
    <div className="bg-white py-4 px-4 shadow-md rounded-lg font-inter">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4">
          {allCategories.map((cat) => (
            <div
              key={cat.name}
              className={`p-2 flex flex-col items-center cursor-pointer transition-colors border-2 rounded-lg ${
                activeCategory === cat.name ? 'border-cyan-600 bg-cyan-50' : 'border-transparent hover:bg-gray-100'
              }`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-16 object-contain mb-1"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/80x80/cccccc/333333?text=${cat.name}`;
                }}
              />
              <span className="text-xs font-semibold text-center text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;