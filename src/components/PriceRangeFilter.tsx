import React, { useState } from 'react';

interface PriceRangeFilterProps {
  onApply: (min: number, max: number) => void;
  minPrice: number;
  maxPrice: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ onApply, minPrice: initialMin, maxPrice: initialMax }) => {
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  const handleApply = () => {
    onApply(min, max);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm font-medium text-gray-700">Price Range:</div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
        />
      </div>
      <button
        onClick={handleApply}
        className="px-4 py-1.5 bg-cyan-600 text-white text-sm rounded-md hover:bg-cyan-700 transition-colors"
      >
        Apply
      </button>
    </div>
  );
};

export default PriceRangeFilter;