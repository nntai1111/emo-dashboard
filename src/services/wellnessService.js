import api from "./api";
import { generateIdempotencyKey } from "../utils/uuid";

// Absolute base for wellness-service to bypass default api baseURL
const WELLNESS_BASE =
  import.meta.env.VITE_API_WELLNESS_URL ||
  "https://api.emoease.vn/wellness-service";

/**
 * Fetch journal moods within a time range.
 * Dates should be ISO strings.
 */
export async function getJournalMoods(startISO, endISO) {
  const url = `${WELLNESS_BASE}/v1/me/journal-moods`;
  const params = {
    StartDate: startISO,
    EndDate: endISO,
  };

  const response = await api.get(url, { params });
  return response.data?.moods ?? [];
}
export async function getWellnessModules(pageIndex = 1, pageSize = 10, targetLang = "vi") {
  const url = `${WELLNESS_BASE}/v1/wellness-modules`;
  const params = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    TargetLang: targetLang,
  };

  const response = await api.get(url, { params });
  return response.data?.modules ?? { data: [], totalCount: 0 };
}

export async function getModuleSections(moduleId, pageIndex = 1, pageSize = 10, targetLang = "vi") {
  const url = `${WELLNESS_BASE}/v1/me/wellness-modules/${moduleId}/module-sections`;
  const params = { PageIndex: pageIndex, PageSize: pageSize, TargetLang: targetLang };
  const response = await api.get(url, { params });
  return response.data?.sections ?? { data: [], totalCount: 0 };
}
export async function getSectionDetail(sectionId, targetLang = "vi") {
  const url = `${WELLNESS_BASE}/v1/me/module-sections/${sectionId}`;
  const params = {
    PageIndex: 1,
    PageSize: 10,
    TargetLang: targetLang, // ← Sửa: "vi" thay vì "string"
  };

  const response = await api.get(url, { params });
  return response.data?.sections?.data?.[0]; // ← Có articles
}

export async function getModuleSectionsByCategory(
  category,
  moduleSectionId = "f44d8122-c4da-4d70-a21e-d59bd1a44adf",
  pageIndex = 1,
  pageSize = 10,
  targetLang = "vi"
) {
  const url = `${WELLNESS_BASE}/v1/me/module-sections`;
  const params = {
    ModuleSectionId: moduleSectionId,
    PageIndex: pageIndex,
    PageSize: pageSize,
    TargetLang: targetLang,
    Category: category,
  };

  const response = await api.get(url, { params });
  return response.data?.sections ?? { data: [], totalCount: 0 };
}

/**
 * Create a new module progress entry (for first-time reading)
 * @param {string} moduleSectionId - The ID of the module section
 * @param {string} sectionArticleId - The ID of the article
 * @returns {Promise} API response
 */
export async function createModuleProgress(moduleSectionId, sectionArticleId) {
  const url = `${WELLNESS_BASE}/v1/me/module-progress`;
  const idempotencyKey = generateIdempotencyKey();

  const response = await api.post(
    url,
    {
      moduleSectionId,
      sectionArticleId,
    },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return response.data;
}

/**
 * Update module progress (for articles that have been read before)
 * @param {string} moduleSectionId - The ID of the module section
 * @param {string} sectionArticleId - The ID of the article
 * @param {number} minutesRead - Number of minutes read (optional)
 * @param {string} processStatus - Process status: "InProgress" or "Completed" (optional)
 * @returns {Promise} API response
 */
export async function updateModuleProgress(
  moduleSectionId,
  sectionArticleId,
  minutesRead = null,
  processStatus = null
) {
  const url = `${WELLNESS_BASE}/v1/me/module-progress`;

  const body = {
    moduleSectionId,
    sectionArticleId,
  };

  // Only include optional fields if provided
  if (minutesRead !== null) {
    body.minutesRead = minutesRead;
  }

  if (processStatus !== null) {
    body.processStatus = processStatus;
  }

  const response = await api.put(url, body);
  return response.data;
}

/**
 * Track article reading progress
 * Automatically chooses between POST (first time) or PUT (already read)
 * If isFirstTime is null/undefined, will try PUT first, then POST if 404
 * @param {string} moduleSectionId - The ID of the module section
 * @param {string} sectionArticleId - The ID of the article
 * @param {boolean} isFirstTime - Whether this is the first time reading (null = auto-detect)
 * @param {number} minutesRead - Number of minutes read (optional)
 * @returns {Promise} API response
 */
export async function trackArticleProgress(
  moduleSectionId,
  sectionArticleId,
  isFirstTime = null,
  minutesRead = null
) {
  // If isFirstTime is explicitly true, use POST
  if (isFirstTime === true) {
    return await createModuleProgress(moduleSectionId, sectionArticleId);
  }

  // If isFirstTime is explicitly false, use PUT
  if (isFirstTime === false) {
    return await updateModuleProgress(moduleSectionId, sectionArticleId, minutesRead);
  }

  // Auto-detect: Try PUT first (for update), if 404 then use POST (for create)
  try {
    return await updateModuleProgress(moduleSectionId, sectionArticleId, minutesRead);
  } catch (error) {
    // If PUT returns 404, it means progress doesn't exist yet, so use POST
    if (error.response?.status === 404) {
      return await createModuleProgress(moduleSectionId, sectionArticleId);
    }
    // For other errors, re-throw
    throw error;
  }
}

/**
 * Get user progress statistics
 * @returns {Promise} API response with stats
 */
export async function getProgressStats() {
  const url = `${WELLNESS_BASE}/v1/me/progress-stats`;
  const response = await api.get(url);
  return response.data?.stats ?? {
    totalArticlesRead: 0,
    totalReadingMinutes: 0,
    totalChallengesCompleted: 0,
    activityDurations: {},
  };
}

export default {
  getJournalMoods,
  getWellnessModules,
  getModuleSections,
  getSectionDetail,
  getModuleSectionsByCategory,
  createModuleProgress,
  updateModuleProgress,
  trackArticleProgress,
  getProgressStats,
};
