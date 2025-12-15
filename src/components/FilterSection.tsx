import React from 'react';

interface FilterSectionProps {
  onApplyFilters: (filters: any) => void; // Placeholder for filter application
  onClose: () => void; // Function to close the filter section
}

const FilterSection: React.FC<FilterSectionProps> = ({ onApplyFilters, onClose }) => {
  // In a real app, you'd have state for various filter options (price range, brand, etc.)
  const handleApply = () => {
    // Simulate applying filters
    console.log('Applying filters...');
    onApplyFilters({}); // Pass actual filter values here
    onClose(); // Close after applying
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner mt-4 font-inter">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Filters</h3>
      <div className="space-y-4">
        {/* Example Filter Option */}
        <div>
          <label htmlFor="priceRange" className="block text-gray-700 text-sm font-semibold mb-2">Price Range</label>
          <input
            type="range"
            id="priceRange"
            min="0"
            max="10000"
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>₹0</span>
            <span>₹10000+</span>
          </div>
        </div>
        
        {/* Add more filter options here (e.g., Brand, Rating, etc.) */}
        <p className="text-gray-500 text-sm">More filter options coming soon!</p>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;