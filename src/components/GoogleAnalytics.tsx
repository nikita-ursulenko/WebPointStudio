import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

const GA_MEASUREMENT_ID = 'G-NCED126ZZ5';

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA script if not already present
        if (!window.gtag) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', GA_MEASUREMENT_ID);
            window.gtag = gtag;
        }
    }, []);

    useEffect(() => {
        // Track page view on route change
        if (window.gtag) {
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

export default GoogleAnalytics;
