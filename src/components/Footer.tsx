import React from 'react';
import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 font-inter">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        {/* Company Name & Copyright */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white">ProductZone</h3>
          <p className="text-xs text-gray-400 mt-1">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
        
        {/* Contact Info (Email) */}
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300">contact@productzone.com</span>
        </div>
        
        {/* Social Media Section */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;