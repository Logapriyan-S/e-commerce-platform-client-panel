import React from 'react';
import { Mail, Instagram, Linkedin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section className="py-12 border-t border-gray-200" id="contact">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-cyan-700 mb-6">Contact Us</h2>
        <p className="text-gray-700 mb-4">
          We’d love to hear from you! Reach out for queries, support, or collaborations.
        </p>
        <div className="flex justify-center items-center space-x-8 mt-4">
          <a href="mailto:support@productzone.com" className="text-gray-600 hover:text-cyan-700 flex items-center">
            <Mail className="mr-2" /> support@productzone.com
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-700 flex items-center">
            <Linkedin className="mr-2" /> LinkedIn
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-700 flex items-center">
            <Instagram className="mr-2" /> Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
