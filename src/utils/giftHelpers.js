import digitalGoodsData from '../data/digitalGoods.json';

/**
 * Get gift information by giftId
 * @param {string} giftId - The gift ID to look up
 * @returns {Object|null} - Gift object with name and mediaUrl, or null if not found
 */
export const getGiftById = (giftId) => {
    if (!giftId) return null;

    const gift = digitalGoodsData.digitalGoods.find(item => item.id === giftId);
    return gift || null;
};

/**
 * Get gift name by giftId
 * @param {string} giftId - The gift ID to look up
 * @returns {string} - Gift name or 'Unknown Gift' if not found
 */
export const getGiftNameById = (giftId) => {
    const gift = getGiftById(giftId);
    return gift ? gift.name : 'Unknown Gift';
};

/**
 * Get gift media URL by giftId
 * @param {string} giftId - The gift ID to look up
 * @returns {string|null} - Gift media URL or null if not found
 */
export const getGiftMediaUrlById = (giftId) => {
    const gift = getGiftById(giftId);
    return gift ? gift.mediaUrl : null;
};

/**
 * Get all available gifts
 * @returns {Array} - Array of all gift objects
 */
export const getAllGifts = () => {
    return digitalGoodsData.digitalGoods || [];
};

/**
 * Get gift by message (fallback when giftId doesn't match)
 * @param {string} message - The gift message to match
 * @returns {Object|null} - Gift object or null if not found
 */
export const getGiftByMessage = (message) => {
    if (!message) return null;

    const gift = digitalGoodsData.digitalGoods.find(item =>
        item.name === message ||
        item.name.toLowerCase().includes(message.toLowerCase()) ||
        message.toLowerCase().includes(item.name.toLowerCase())
    );
    return gift || null;
};

/**
 * Fix URL encoding issues (smart quotes, etc.)
 * @param {string} url - The URL to fix
 * @returns {string} - Fixed URL
 */
const fixUrlEncoding = (url) => {
    if (!url) return url;

    // Replace smart quotes with regular quotes
    return url
        .replace(/'/g, "'")  // Replace smart quote with regular quote
        .replace(/'/g, "'")  // Replace other smart quote variants
        .replace(/"/g, '"')  // Replace smart double quotes
        .replace(/"/g, '"'); // Replace other smart double quote variants
};

/**
 * Smart gift finder - tries multiple methods to find gift data
 * @param {string} giftId - The gift ID from API
 * @param {string} message - The gift message from API
 * @returns {Object|null} - Gift object or null if not found
 */
export const getGiftSmart = (giftId, message) => {
    // First try: Find by giftId (exact match)
    let gift = getGiftById(giftId);
    if (gift) {
        // Fix URL encoding issues
        if (gift.mediaUrl) {
            gift.mediaUrl = fixUrlEncoding(gift.mediaUrl);
        }
        return gift;
    }

    // Second try: Find by message (exact match first)
    if (message) {
        gift = digitalGoodsData.digitalGoods.find(item => item.name === message);
        if (gift) {
            // Fix URL encoding issues
            if (gift.mediaUrl) {
                gift.mediaUrl = fixUrlEncoding(gift.mediaUrl);
            }
            return gift;
        }

        // Third try: Find by message (fuzzy match)
        gift = getGiftByMessage(message);
        if (gift) {
            // Fix URL encoding issues
            if (gift.mediaUrl) {
                gift.mediaUrl = fixUrlEncoding(gift.mediaUrl);
            }
            return gift;
        }
    }

    return null;
};
