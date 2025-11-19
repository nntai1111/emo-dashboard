import { useState, useEffect } from 'react';

export const useGiftReceivedEffect = () => {
    const [showGiftEffect, setShowGiftEffect] = useState(false);
    const [giftData, setGiftData] = useState(null);

    useEffect(() => {
        const handleNotification = (event) => {
            const { type, notificationType, giftId, snippet } = event.detail || {};

            // Check if it's a gift notification (type 8)
            if (type === 'gift' || notificationType === 8) {
                const newGiftData = { giftId, snippet };
                setGiftData(newGiftData);
                setShowGiftEffect(true);
            }
        };

        // Listen for custom gift notification events
        window.addEventListener('app:gift:received', handleNotification);

        // Also listen for regular toast events that might be gift notifications
        const handleToast = (event) => {
            const { notificationType, title, message, giftId } = event.detail || {};

            // Check if it's a gift notification by type or by message content
            if (notificationType === 8 ||
                (message && message.includes('gửi bạn một món quà')) ||
                (title && title.includes('gửi bạn một món quà'))) {
                const newGiftData = { giftId, snippet: message };
                setGiftData(newGiftData);
                setShowGiftEffect(true);
            }
        };

        window.addEventListener('app:toast', handleToast);

        return () => {
            window.removeEventListener('app:gift:received', handleNotification);
            window.removeEventListener('app:toast', handleToast);
        };
    }, []);

    const triggerGiftEffect = () => {
        setShowGiftEffect(true);
    };

    const hideGiftEffect = () => {
        setShowGiftEffect(false);
        setGiftData(null); // Clear gift data when hiding
    };

    return {
        showGiftEffect,
        giftData,
        triggerGiftEffect,
        hideGiftEffect
    };
};
