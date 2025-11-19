import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Card from "../atoms/CardWellness";
import { FaCertificate, FaBriefcase, FaClock, FaBookOpen, FaArrowRight, FaTasks } from "react-icons/fa"; // Ensure icons are imported
import { getProgressStats } from "../../services/wellnessService";
import { getChallengeProgresses } from "../../services/challengeService";

const LearningStats = ({ challengeProgresses = [] }) => {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState(null);
    const itemRefs = useRef(new Map());

    // Convert challengeProgresses to format compatible with Card component
    const challengeCards = challengeProgresses.map((cp, index) => {
        const progressPercent = cp.progressPercent !== undefined && cp.progressPercent !== null
            ? cp.progressPercent
            : (cp.steps && cp.steps.length > 0
                ? Math.round((cp.steps.filter(s => s.processStatus === "Completed").length / cp.steps.length) * 100)
                : 0);

        const totalSteps = cp.steps?.length || 0;
        const completedSteps = cp.steps?.filter(s => s.processStatus === "Completed").length || 0;

        return {
            id: cp.id || `challenge-${index}`,
            title: cp.challengeTitle || t("wellness.unknownChallenge"),
            places: totalSteps > 0 ? `${completedSteps}/${totalSteps} ${t("wellness.steps")}` : "",
            percent: progressPercent,
            bg: cp.challengeMediaUrl || "https://d37bukf1aia83y.cloudfront.net/wellness/plexus/2ef4d0c8-07e2-4645-8118-41aa0a8150bf_file.jpg", // Default background or can be customized
            challengeType: cp.challengeType,
            processStatus: cp.processStatus,
            startDate: cp.startDate,
        };
    });

    useEffect(() => {
        if (challengeCards.length > 0 && !activeId) {
            setActiveId(challengeCards[0].id);
        }
    }, [challengeCards.length, activeId, challengeCards]);

    useEffect(() => {
        if (activeId) {
            const activeElement = itemRefs.current.get(activeId);
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    }, [activeId]);

    if (challengeCards.length === 0) {
        return (
            <div className="w-full max-w-md mx-auto h-[400px] flex items-center justify-center">
                <p className="text-sm text-gray-600">{t("wellness.noChallenges")}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto h-[550px] overflow-y-auto snap-y snap-mandatory flex flex-col px-4 scrollbar-none">
            {challengeCards.map((item) => (
                <Card
                    key={item.id}
                    item={item}
                    isActive={item.id === activeId}
                    circumference={2 * Math.PI * 24}
                    setActiveId={setActiveId}
                    ref={(el) => itemRefs.current.set(item.id, el)}
                />
            ))}
        </div>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalArticlesRead: 0,
        totalReadingMinutes: 0,
        totalChallengesCompleted: 0,
        activityDurations: {},
    });
    const [challengeStats, setChallengeStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
    });
    const [challengeProgresses, setChallengeProgresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [challengeLoading, setChallengeLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getProgressStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching progress stats:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchChallengeProgresses = async () => {
            try {
                setChallengeLoading(true);
                // Lấy tất cả challenge progresses
                const response = await getChallengeProgresses(
                    null, // processStatus - null để lấy tất cả
                    null, // challengeType - null để lấy tất cả
                    1,
                    100, // Lấy nhiều để có đủ dữ liệu
                    "vi"
                );

                const progresses = response.data || [];

                // Lưu danh sách challenge progresses
                setChallengeProgresses(progresses);

                // Tính toán số liệu
                const completed = progresses.filter(p => p.processStatus === "Completed").length;
                const inProgress = progresses.filter(p => p.processStatus === "Progressing").length;
                const notStarted = progresses.filter(p => p.processStatus === "NotStarted" || !p.processStatus).length;

                setChallengeStats({
                    total: progresses.length,
                    completed,
                    inProgress,
                    notStarted,
                });
            } catch (error) {
                console.error("Error fetching challenge progresses:", error);
            } finally {
                setChallengeLoading(false);
            }
        };

        fetchStats();
        fetchChallengeProgresses();
    }, []);

    // Calculate percentage for progress circle (assuming max 100 minutes for 100%)
    const calculateProgress = (value, max = 100) => {
        const percentage = Math.min((value / max) * 100, 100);
        const circumference = 2 * Math.PI * 20;
        return circumference - (percentage / 100) * circumference;
    };

    // Calculate challenge progress percentage
    // Use progressPercent from API if available, otherwise calculate from steps
    const calculateChallengeProgress = (challengeProgress) => {
        // Use progressPercent from API if available
        if (challengeProgress.progressPercent !== undefined && challengeProgress.progressPercent !== null) {
            return challengeProgress.progressPercent;
        }
        // Fallback: calculate from steps
        if (!challengeProgress.steps || challengeProgress.steps.length === 0) {
            return 0;
        }
        const completedSteps = challengeProgress.steps.filter(
            step => step.processStatus === "Completed"
        ).length;
        return Math.round((completedSteps / challengeProgress.steps.length) * 100);
    };

    // Get status label and color
    const getStatusInfo = (status) => {
        switch (status) {
            case "Completed":
                return { label: t("wellness.completed"), color: "text-green-700", bgColor: "bg-green-100" };
            case "Progressing":
                return { label: t("wellness.inProgress"), color: "text-blue-700", bgColor: "bg-blue-100" };
            case "NotStarted":
                return { label: t("wellness.notStarted"), color: "text-gray-600", bgColor: "bg-gray-100" };
            default:
                return { label: status || t("wellness.notStarted"), color: "text-gray-600", bgColor: "bg-gray-100" };
        }
    };

    // Prepare activity chart data
    const activityChartData = Object.entries(stats.activityDurations || {}).map(([type, minutes]) => ({
        type,
        minutes,
        label: t(`wellness.activityTypes.${type}`, type),
    })).sort((a, b) => b.minutes - a.minutes);

    const maxActivityMinutes = activityChartData.length > 0
        ? Math.max(...activityChartData.map(d => d.minutes), 100)
        : 100;

    return (
        <div className="w-full max-w-md lg:max-w-7xl mx-auto p-4 md:p-5 lg:p-6 overflow-y-auto">
            {/* Desktop: 2 columns layout, Mobile: single column */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Statistics cards - Compact */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Articles Read */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[120px]">
                            <div className="flex justify-center mb-2">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-12 h-12 transform -rotate-90 absolute">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-green-200"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-green-500"
                                            strokeDasharray={2 * Math.PI * 20}
                                            strokeDashoffset={calculateProgress(stats.totalArticlesRead, 10)}
                                            fill="transparent"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <FaBookOpen className="relative z-10 text-green-600 text-lg" />
                                </div>
                            </div>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                                {loading ? "..." : stats.totalArticlesRead}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t("wellness.articles")}</p>
                        </div>

                        {/* Reading Minutes */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[120px]">
                            <div className="flex justify-center mb-2">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-12 h-12 transform -rotate-90 absolute">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-purple-200"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-purple-500"
                                            strokeDasharray={2 * Math.PI * 20}
                                            strokeDashoffset={calculateProgress(stats.totalReadingMinutes, 100)}
                                            fill="transparent"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <FaClock className="relative z-10 text-purple-600 text-lg" />
                                </div>
                            </div>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                                {loading ? "..." : stats.totalReadingMinutes}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t("wellness.minutes")}</p>
                        </div>

                        {/* Challenges Completed */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[120px]">
                            <div className="flex justify-center mb-2">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-12 h-12 transform -rotate-90 absolute">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-orange-200"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-orange-500"
                                            strokeDasharray={2 * Math.PI * 20}
                                            strokeDashoffset={calculateProgress(challengeStats.completed, 10)}
                                            fill="transparent"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <FaCertificate className="relative z-10 text-orange-600 text-lg" />
                                </div>
                            </div>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                                {challengeLoading ? "..." : challengeStats.completed}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t("wellness.completedChallenges")}</p>
                        </div>

                        {/* Challenges In Progress */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[120px]">
                            <div className="flex justify-center mb-2">
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-12 h-12 transform -rotate-90 absolute">
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-blue-200"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            className="text-blue-500"
                                            strokeDasharray={2 * Math.PI * 20}
                                            strokeDashoffset={calculateProgress(challengeStats.inProgress, 10)}
                                            fill="transparent"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <FaTasks className="relative z-10 text-blue-600 text-lg" />
                                </div>
                            </div>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                                {challengeLoading ? "..." : challengeStats.inProgress}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{t("wellness.inProgressChallenges")}</p>
                        </div>
                    </div>

                    {/* Reading Time Progress */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FaBookOpen className="text-purple-600 text-base" />
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("wellness.totalReadingTime")}</p>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {loading ? "..." : `${stats.totalReadingMinutes} ${t("wellness.minutesUnit")}`}
                            </p>
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                style={{
                                    width: loading ? "0%" : `${Math.min((stats.totalReadingMinutes / 100) * 100, 100)}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Activity Durations Chart - Desktop only */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-4">
                            <FaClock className="text-blue-600 text-base" />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("wellness.activityTime")}</p>
                        </div>
                        {activityChartData.length > 0 ? (
                            <div className="space-y-3">
                                {activityChartData.map((item, index) => {
                                    const percentage = (item.minutes / maxActivityMinutes) * 100;
                                    const colors = [
                                        "from-blue-500 to-blue-600",
                                        "from-purple-500 to-purple-600",
                                        "from-green-500 to-green-600",
                                        "from-orange-500 to-orange-600",
                                        "from-pink-500 to-pink-600",
                                    ];
                                    const colorClass = colors[index % colors.length];
                                    return (
                                        <div key={item.type} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{item.minutes} {t("wellness.minutesUnit")}</span>
                                            </div>
                                            <div className="relative w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-700`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : !loading ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t("wellness.noActivityData")}</p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t("wellness.loading")}</p>
                        )}
                    </div>
                </div>

                {/* Right Column - Desktop only */}
                <div className="hidden lg:block space-y-4">
                    {/* LearningStats Component */}
                    <LearningStats challengeProgresses={challengeProgresses} />
                </div>
            </div>

            {/* Mobile: Activity Durations and LearningStats below */}
            <div className="lg:hidden space-y-4 mt-4">
                {/* Activity Durations Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4">
                        <FaClock className="text-blue-600 text-base" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("wellness.activityTime")}</p>
                    </div>
                    {activityChartData.length > 0 ? (
                        <div className="space-y-3">
                            {activityChartData.map((item, index) => {
                                const percentage = (item.minutes / maxActivityMinutes) * 100;
                                const colors = [
                                    "from-blue-500 to-blue-600",
                                    "from-purple-500 to-purple-600",
                                    "from-green-500 to-green-600",
                                    "from-orange-500 to-orange-600",
                                    "from-pink-500 to-pink-600",
                                ];
                                const colorClass = colors[index % colors.length];
                                return (
                                    <div key={item.type} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{item.minutes} {t("wellness.minutesUnit")}</span>
                                        </div>
                                        <div className="relative w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-700`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : !loading ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t("wellness.noActivityData")}</p>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t("wellness.loading")}</p>
                    )}
                </div>

                {/* LearningStats Component */}
                <LearningStats challengeProgresses={challengeProgresses} />
            </div>

        </div>
    );
};

export default Dashboard;