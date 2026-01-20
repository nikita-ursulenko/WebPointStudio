import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, updateSessionDuration, getSessionId, trackEvent } from '@/lib/analytics';

export const useAnalytics = () => {
    const location = useLocation();
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // Exclude admin paths
        if (location.pathname.startsWith('/admin')) {
            return;
        }

        // Track page view when route changes
        trackPageView(location.pathname);

        // Reset start time for new page
        startTimeRef.current = Date.now();

        // Cleanup: update duration when leaving page
        return () => {
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (duration > 0) {
                updateSessionDuration(getSessionId(), duration);
            }
        };
    }, [location.pathname]);

    return { trackEvent };
};
