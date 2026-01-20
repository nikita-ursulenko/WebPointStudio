import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const VISITOR_ID_KEY = 'webpoint_visitor_id';
const SESSION_ID_KEY = 'webpoint_session_id';

// Get or create visitor ID (persistent across sessions)
export const getVisitorId = (): string => {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
        visitorId = uuidv4();
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
};

// Get or create session ID (temporary for current session)
export const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
};

// Track page view
export const trackPageView = async (pagePath: string, referrer?: string) => {
    // Exclude admin paths
    if (pagePath.startsWith('/admin')) {
        return;
    }

    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const userAgent = navigator.userAgent;

    try {
        const { error } = await supabase.from('analytics_sessions').insert({
            session_id: sessionId,
            visitor_id: visitorId,
            page_path: pagePath,
            referrer: referrer || document.referrer || null,
            user_agent: userAgent,
        });

        if (error) {
            console.error('Error tracking page view:', error);
        }
    } catch (err) {
        console.error('Failed to track page view:', err);
    }
};

// Track custom event
export const trackEvent = async (
    eventName: string,
    eventLabel?: string,
    eventType: string = 'click'
) => {
    const pagePath = window.location.pathname;

    // Exclude admin paths
    if (pagePath.startsWith('/admin')) {
        return;
    }

    const sessionId = getSessionId();

    try {
        const { error } = await supabase.from('analytics_events').insert({
            session_id: sessionId,
            event_type: eventType,
            event_name: eventName,
            event_label: eventLabel || null,
            page_path: pagePath,
        });

        if (error) {
            console.error('Error tracking event:', error);
        }
    } catch (err) {
        console.error('Failed to track event:', err);
    }
};

// Update session duration
export const updateSessionDuration = async (sessionId: string, duration: number) => {
    try {
        // Find the most recent session record for this session_id
        const { data: sessions, error: fetchError } = await supabase
            .from('analytics_sessions')
            .select('id')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (fetchError || !sessions || sessions.length === 0) {
            return;
        }

        const { error } = await supabase
            .from('analytics_sessions')
            .update({ duration, updated_at: new Date().toISOString() })
            .eq('id', sessions[0].id);

        if (error) {
            console.error('Error updating session duration:', error);
        }
    } catch (err) {
        console.error('Failed to update session duration:', err);
    }
};
