import React from 'react';
import { FaShippingFast, FaLock, FaHeadset } from 'react-icons/fa';

const services = [
  {
    title: 'Fast Delivery',
    description: 'We deliver your orders within 2-3 business days.',
    icon: <FaShippingFast className="text-blue-500 text-4xl" />,
  },
  {
    title: 'Secure Payments',
    description: 'Your transactions are encrypted and safe.',
    icon: <FaLock className="text-blue-500 text-4xl" />,
  },
  {
    title: '24/7 Support',
    description: 'We’re here to help anytime, day or night.',
    icon: <FaHeadset className="text-blue-500 text-4xl" />,
  },
];

const Services: React.FC = () => {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            {service.icon}
            <h3 className="text-xl font-semibold text-gray-800 mt-4">{service.title}</h3>
            <p className="text-gray-500 mt-2 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
