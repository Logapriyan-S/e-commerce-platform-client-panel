import React, { useState } from 'react';

interface Props {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onSearch(e.target.value); // 🔥 Send search value up to parent
  };

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={input}
      onChange={handleChange}
      className="w-full p-3 border rounded shadow-sm"
    />
  );
};

export default SearchBar;
