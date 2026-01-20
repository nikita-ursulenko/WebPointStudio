import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // We use a broader approach to ensure scroll happens even if layouts are heavy
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Fallback for some browsers/mobile scenarios
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
