import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortByDropdownProps {
  onSelect: (value: string) => void;
  currentSort: string;
}

const sortOptions = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: '-name' },
  { label: 'Price (Low to High)', value: 'price' },
  { label: 'Price (High to Low)', value: '-price' },
];

const SortByDropdown: React.FC<SortByDropdownProps> = ({ onSelect, currentSort }) => {
  return (
    <div className="relative inline-block text-left">
      <select
        value={currentSort}
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none block w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
      >
        <option value="">Sort By...</option>
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

export default SortByDropdown;