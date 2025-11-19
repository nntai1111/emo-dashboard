import api from "./api";
import { generateIdempotencyKey } from "../utils/uuid";
import { tokenManager } from "./tokenManager";

// Absolute base for wellness-service
const WELLNESS_BASE =
    import.meta.env.VITE_API_WELLNESS_URL ||
    "https://api.emoease.vn/wellness-service";

/**
 * Get challenges with filters
 * @param {string} challengeType - OneDayChallenge, ThreeDayChallenge, SevenDayChallenge
 * @param {string} improvementTag - MentalHealth, PhysicalBalance, SocialConnection, CreativeRelaxation, Combined
 * @param {number} pageIndex - Page index (default: 1)
 * @param {number} pageSize - Page size (default: 10)
 * @param {string} targetLang - Target language (default: "vi")
 * @returns {Promise} API response with challenges data
 */
export async function getChallenges(
    challengeType = null,
    improvementTag = null,
    pageIndex = 1,
    pageSize = 10,
    targetLang = "vi"
) {
    const url = `${WELLNESS_BASE}/v1/challenges`;
    const params = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        TargetLang: targetLang,
    };

    if (challengeType) {
        params.ChallengeType = challengeType;
    }

    if (improvementTag) {
        params.ImprovementTag = improvementTag;
    }

    const response = await api.get(url, { params });
    return response.data?.challenges ?? { data: [], totalCount: 0 };
}

/**
 * Create a new challenge progress (register for a challenge)
 * @param {string} challengeId - The ID of the challenge
 * @returns {Promise} API response
 */
export async function createChallengeProgress(challengeId) {
    const url = `${WELLNESS_BASE}/v1/me/challenge-progresses`;
    const idempotencyKey = generateIdempotencyKey();

    const response = await api.post(
        url,
        {
            challengeId,
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
 * Get challenge progresses for current user
 * @param {string} processStatus - NotStarted, Progressing, Completed, Skipped (optional)
 * @param {string} challengeType - OneDayChallenge, ThreeDayChallenge, SevenDayChallenge (optional)
 * @param {number} pageIndex - Page index (default: 1)
 * @param {number} pageSize - Page size (default: 10)
 * @param {string} targetLang - Target language (default: "vi")
 * @returns {Promise} API response with challenge progresses data
 */
export async function getChallengeProgresses(
    processStatus = null,
    challengeType = null,
    pageIndex = 1,
    pageSize = 10,
    targetLang = "vi"
) {
    const url = `${WELLNESS_BASE}/v1/me/challenge-progress`;
    const params = {
        PageIndex: pageIndex,
        PageSize: pageSize,
        TargetLang: targetLang,
    };

    if (processStatus) {
        params.ProcessStatus = processStatus;
    }

    if (challengeType) {
        params.ChallengeType = challengeType;
    }

    const response = await api.get(url, { params });
    return response.data?.challengeProgresses ?? { data: [], totalCount: 0 };
}

/**
 * Update challenge progress
 * @param {string} challengeProgressId - The ID of the challenge progress
 * @param {string} stepId - The ID of the step
 * @param {string} stepStatus - NotStarted, Progressing, Completed, Skipped
 * @param {string} postMoodId - The ID of the post mood (optional, can be fixed value)
 * @returns {Promise} API response
 */
export async function updateChallengeProgress(
    challengeProgressId,
    stepId,
    stepStatus,
    postMoodId = null
) {
    const url = `${WELLNESS_BASE}/v1/me/challenge-progress`;

    const body = {
        challengeProgressId,
        stepId,
        stepStatus,
    };

    // Add postMoodId if provided (or use fixed value)
    if (postMoodId) {
        body.postMoodId = postMoodId;
    }

    const response = await api.put(url, body);
    return response.data;
}

export default {
    getChallenges,
    getChallengeProgresses,
    createChallengeProgress,
    updateChallengeProgress,
};

