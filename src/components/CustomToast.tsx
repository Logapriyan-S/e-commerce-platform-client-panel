import React from 'react';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { ToastContentProps } from 'react-toastify';

interface CustomToastProps extends ToastContentProps {
  title: string;
  message: string;
  icon?: 'check' | 'cart' | 'default';
}

const CustomToast: React.FC<CustomToastProps> = ({ title, message, icon = 'check', closeToast }) => {
  const iconComponent = () => {
    switch (icon) {
      case 'cart':
        return <ShoppingBag className="w-8 h-8 text-green-500" />;
      case 'check':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      default:
        return <CheckCircle className="w-8 h-8 text-green-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow-xl border-l-4 border-green-500">
      {iconComponent()}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{message}</p>
      </div>
      <button onClick={closeToast} className="text-gray-400 hover:text-gray-600">
        &times;
      </button>
    </div>
  );
};

export default CustomToast;