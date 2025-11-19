import categoryTagsData from '../data/tagCategory.json';
import emotionTagsData from '../data/tagEmotions1.json';

// Helper function để convert Unicode codepoint thành emoji
export const getUnicodeEmoji = (unicodeCodepoint) => {
    if (!unicodeCodepoint || typeof unicodeCodepoint !== 'string') return '';

    try {
        // Xử lý trường hợp có nhiều codepoint (như "U+1F60A U+1F44D")
        const codepoints = unicodeCodepoint.split(' ').map(cp => {
            const cleanCp = cp.replace('U+', '');
            const parsed = parseInt(cleanCp, 16);
            if (isNaN(parsed) || parsed < 0 || parsed > 0x10FFFF) {
                throw new Error(`Invalid codepoint: ${cleanCp}`);
            }
            return parsed;
        });

        return String.fromCodePoint(...codepoints);
    } catch (error) {
        console.warn('Error parsing unicode codepoint:', unicodeCodepoint, error);
        return '';
    }
};

// Mapping ID mới từ API với ID cũ trong JSON (theo thứ tự)
const API_ID_MAPPING = {
    "772eec7e-55f7-4729-b6d1-c99d9d21fe2b": 0, // relationships
    "f2ad307c-d771-4c09-98f3-13691c51d6da": 1, // family
    "8bc81ddd-66e6-4dfc-bfc4-7fd87ca10b5c": 2, // habits
    "7f6569b0-b1fe-4c0b-b8bc-fed8aabb10d4": 3, // friends
    "3ab22d69-183d-4f21-b866-c81b7433f6d1": 4, // hopes
    "69a318c3-6a0c-41a2-941b-56b8e4d65e31": 5, // bullying
    "de70373a-5070-4556-afa5-611689b52d8a": 6, // health
    "0cc7adc5-b40b-433c-8513-642b5289eff0": 7, // work
    "e7b0476a-714a-4d41-892c-e83d8f819263": 8, // music
    "7bfc4693-ec77-4e05-9d21-79d7ae000e69": 9, // helpful tips
    "294bff61-5f42-48de-b514-96988e25fe84": 10, // parenting
    "dbe2fe15-bc5e-4a7d-ac87-23692aa1fc80": 11, // education
    "79e84978-886f-47ef-a724-ee5d990cb4dd": 12, // religion
    "b7b48afe-4300-43a4-8748-530a8b493565": 13, // lgbtq
    "e8dcb402-e04f-4a84-882f-883b6c05bdc1": 14, // pregnancy
    "357a2878-c0a6-4f65-be7d-8bc23cf391af": 15, // positive
    "a12a2d6d-5984-4858-a055-aec62c6e3550": 16, // wellbeing
    "e88d107a-86b1-495c-869c-d1e2d1c28831": 17, // my story
};

// Lấy thông tin category tag từ ID (chỉ dùng JSON data)
export const getCategoryTagById = async (categoryTagId) => {
    if (!categoryTagId) return null;

    // Chỉ tìm trong JSON data, không gọi API
    const jsonResult = categoryTagsData.categoryTags.find(tag => tag.id === categoryTagId);
    if (jsonResult) {
        return jsonResult;
    }

    // Thử mapping với ID mới từ API
    const mappedIndex = API_ID_MAPPING[categoryTagId];
    if (mappedIndex !== undefined && categoryTagsData.categoryTags[mappedIndex]) {
        const mappedCategory = categoryTagsData.categoryTags[mappedIndex];
        return {
            ...mappedCategory,
            id: categoryTagId // Giữ ID mới từ API
        };
    }
    // Fallback: tạo object với ID nếu không tìm thấy
    return {
        id: categoryTagId,
        displayName: `Category ${categoryTagId.slice(0, 8)}`,
        unicodeCodepoint: "U+1F3F7", // Tag emoji
        code: "unknown"
    };
};

// Lấy thông tin emotion tag từ ID (chỉ dùng JSON data)
export const getEmotionTagById = async (emotionTagId) => {
    if (!emotionTagId) return null;

    // Tìm trong tất cả categories của emotionTagsData
    for (const category of emotionTagsData.emotionCategories) {
        const jsonResult = category.emotions.find(tag => tag.id === emotionTagId);
        if (jsonResult) {
            return jsonResult;
        }
    }

    // Fallback: tạo object với ID nếu không tìm thấy
    return {
        id: emotionTagId,
        displayName: `Emotion ${emotionTagId.slice(0, 8)}`,
        unicodeCodepoint: "U+1F60A", // Smile emoji
        code: "unknown"
    };
};

// Lấy danh sách category tags từ array IDs hoặc single ID
export const getCategoryTagsByIds = async (categoryTagIds) => {
    // Xử lý cả array và single value
    let ids = categoryTagIds;
    if (!Array.isArray(ids)) {
        ids = ids ? [ids] : [];
    }
    if (ids.length === 0) return [];

    const results = await Promise.all(ids.map(id => getCategoryTagById(id)));
    return results.filter(tag => tag !== null);
};

// Lấy danh sách emotion tags từ array IDs hoặc single ID
export const getEmotionTagsByIds = async (emotionTagIds) => {
    // Xử lý cả array và single value
    let ids = emotionTagIds;
    if (!Array.isArray(ids)) {
        ids = ids ? [ids] : [];
    }
    if (ids.length === 0) return [];

    const results = await Promise.all(ids.map(id => getEmotionTagById(id)));
    return results.filter(tag => tag !== null);
};

// Màu theo từng chủ đề (category code)
export const getCategoryColorClasses = (category) => {
    const code = (category?.code || "").toLowerCase();
    const colorByCode = {
        relationships: "pink",
        family: "rose",
        friends: "cyan",
        health: "green",
        wellbeing: "emerald",
        work: "amber",
        education: "violet",
        music: "indigo",
        lgbtq: "fuchsia",
        bullying: "red",
        hopes: "yellow",
        resilience: "teal",
        challenges: "orange",
        stress: "orange",
        grief: "slate",
        parenting: "lime",
        guidance: "sky",
        religion: "purple",
        emotions: "purple",
        politics: "stone",
        others: "gray",
    };
    const color = colorByCode[code] || "blue";

    // Trả về các class đã tổng hợp để dùng cho container, icon và text
    return {
        container: `bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-700 hover:bg-${color}-100 dark:hover:bg-${color}-900/40`,
        icon: `text-${color}-600 dark:text-${color}-400`,
        text: `text-${color}-700 dark:text-${color}-300`,
    };
};

// Safelist Tailwind (để tránh bị purge các màu động). Các chuỗi dưới đây cố ý giữ nguyên.
// eslint-disable-next-line no-unused-vars
const __CATEGORY_COLOR_SAFELIST = [
    "bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900/40",
    "text-pink-600 dark:text-pink-400", "text-pink-700 dark:text-pink-300",
    "bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/40",
    "text-rose-600 dark:text-rose-400", "text-rose-700 dark:text-rose-300",
    "bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/40",
    "text-cyan-600 dark:text-cyan-400", "text-cyan-700 dark:text-cyan-300",
    "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/40",
    "text-green-600 dark:text-green-400", "text-green-700 dark:text-green-300",
    "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    "text-emerald-600 dark:text-emerald-400", "text-emerald-700 dark:text-emerald-300",
    "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40",
    "text-amber-600 dark:text-amber-400", "text-amber-700 dark:text-amber-300",
    "bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/40",
    "text-violet-600 dark:text-violet-400", "text-violet-700 dark:text-violet-300",
    "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/40",
    "text-indigo-600 dark:text-indigo-400", "text-indigo-700 dark:text-indigo-300",
    "bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-700 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40",
    "text-fuchsia-600 dark:text-fuchsia-400", "text-fuchsia-700 dark:text-fuchsia-300",
    "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40",
    "text-red-600 dark:text-red-400", "text-red-700 dark:text-red-300",
    "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40",
    "text-yellow-600 dark:text-yellow-400", "text-yellow-700 dark:text-yellow-300",
    "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/40",
    "text-teal-600 dark:text-teal-400", "text-teal-700 dark:text-teal-300",
    "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/40",
    "text-orange-600 dark:text-orange-400", "text-orange-700 dark:text-orange-300",
    "bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/40",
    "text-slate-600 dark:text-slate-400", "text-slate-700 dark:text-slate-300",
    "bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-700 hover:bg-lime-100 dark:hover:bg-lime-900/40",
    "text-lime-600 dark:text-lime-400", "text-lime-700 dark:text-lime-300",
    "bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/40",
    "text-sky-600 dark:text-sky-400", "text-sky-700 dark:text-sky-300",
    "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/40",
    "text-purple-600 dark:text-purple-400", "text-purple-700 dark:text-purple-300",
    "bg-stone-50 dark:bg-stone-900/20 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-900/40",
    "text-stone-600 dark:text-stone-400", "text-stone-700 dark:text-stone-300",
    "bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900/40",
    "text-gray-600 dark:text-gray-400", "text-gray-700 dark:text-gray-300",
    "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40",
    "text-blue-600 dark:text-blue-400", "text-blue-700 dark:text-blue-300",
];
