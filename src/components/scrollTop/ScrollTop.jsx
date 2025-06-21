import React, { useState, useEffect } from 'react';

const ScrollTop = () => {
  const [visible, setVisible] = useState(false);

  // Show the button when the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {  // Show button after scrolling 200px
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button 
        onClick={scrollToTop}
        className="scroll-to-top-btn"
      >
        ↑
      </button>
    )
  );
};

export default ScrollTop;
