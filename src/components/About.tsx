import React from 'react';

// SVG Icons for features (Updated with brand color)
const FastDeliveryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-9m17.25 9v-9m-9-4.5h.008v.008H12v-.008zM12 1.5S10.5 4.5 9 6c-1.5 1.5-3 1.5-3 1.5s.75 1.5 2.25 3c1.5 1.5 3 2.25 3 2.25s1.5-1.5 3-3c1.5-1.5 2.25-3 2.25-3s-1.5 0-3-1.5C13.5 4.5 12 1.5 12 1.5z" />
  </svg>
);

const BestQualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 4.5-3-3m-3 3l-3-3m-12-3h18M3 12h18m-9-9v18" />
  </svg>
);


const About: React.FC = () => {
  return (
    <div className="bg-white">
      <main className="isolate">
        {/* About Us Section */}
        <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-blue-50/20 pt-14"> {/* UPDATED COLOR */}
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                About Our Store
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg leading-8 text-gray-600">
                  At ProductZone, we believe shopping should be simple, enjoyable, and
                  secure. Our mission is to provide high-quality products with exceptional
                  customer service, creating a seamless experience from Browse to unboxing.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We cater to a wide range of needs — from everyday essentials to unique specialty
                  items. Backed by a passionate team and strong values, we aim to deliver excellence in
                  everything we do. Thank you for being a part of our journey. We're excited to serve you!
                </p>
              </div>
              
              {/* === THIS IS THE UPDATED IMAGE SECTION === */}
              <div className="mt-10 max-w-lg lg:mt-0 lg:max-w-none lg:row-start-2 lg:row-end-4 lg:place-self-center">
                  <img
                    src="/your-image.jpg" // <-- IMPORTANT: Change this to your actual file name
                    alt="A professional view of the ProductZone storefront or team"
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2] lg:h-full shadow-xl"
                  />
              </div>

            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8 mb-24">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">The ProductZone Difference</h2> {/* UPDATED COLOR */}
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Us
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We aren't just another online store. We are dedicated to providing a superior shopping experience through our core commitments.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              
              <div className="flex flex-col p-6 rounded-lg bg-gray-50 hover:bg-white hover:shadow-xl transition-shadow duration-300 ring-1 ring-inset ring-gray-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <FastDeliveryIcon />
                  Fast & Safe Delivery
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">We make sure your products reach you quickly and safely. Our streamlined logistics network ensures timely and secure delivery to your doorstep.</p>
                </dd>
              </div>

              <div className="flex flex-col p-6 rounded-lg bg-gray-50 hover:bg-white hover:shadow-xl transition-shadow duration-300 ring-1 ring-inset ring-gray-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <BestQualityIcon />
                  Best Quality Guaranteed
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Only top-rated and thoroughly checked items make it into our catalog. We stand by the quality of our products, ensuring you get the best value.</p>
                </dd>
              </div>

              <div className="flex flex-col p-6 rounded-lg bg-gray-50 hover:bg-white hover:shadow-xl transition-shadow duration-300 ring-1 ring-inset ring-gray-100">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <SupportIcon />
                  24/7 Friendly Support
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Need help? Our friendly and knowledgeable support team is here for you around the clock to assist with any questions or concerns.</p>
                </dd>
              </div>

            </dl>
          </div>
        </div>

      </main>
    </div>
  );
};

export default About;