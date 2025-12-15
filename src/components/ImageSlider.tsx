import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  images: { src: string; alt: string }[];
  interval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [current, interval, images.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            // CORRECTED: Reverted to `object-cover` to fill the space without white gaps.
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button onClick={prevSlide} className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2">
        {images.map((_, index) => (
          <div key={index} className="w-12 h-1 relative cursor-pointer" onClick={() => setCurrent(index)}>
            <div className="w-full h-full bg-gray-400 rounded-full" />
            {index === current && (
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{
                  animation: `timer-fill ${interval / 1000}s linear forwards`
                }}
              />
            )}
          </div>
        ))}
      </div>
      
      <style>
        {`
          @keyframes timer-fill {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ImageSlider;