// @ts-nocheck


export const GA_TRACKING_ID = 'G-318188833'; // Replace with your Measurement ID

// Track pageviews
export const pageview = (url: string) => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    });
};

// Track specific events

export const event = ({ action, category, label, value }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};
