import React from 'react';

const NoPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-purple-100 relative overflow-hidden">
      {/* Glowing Background Layer */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.2)_0%,_rgba(255,255,255,0.3)_100%)]" />

      {/* Main Content */}
      <div className="z-10 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png"
          alt="404"
          className="w-20 sm:w-24 md:w-28 lg:w-32 mb-4 mx-auto"
        />
        <h1 className="text-xl sm:text-2xl font-semibold text-purple-800">
          404 - Page Not Found
        </h1>
      </div>
    </div>
  );
};

export default NoPage;
