import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Check, ChevronDown, Calendar, Clock, AlertCircle, ChevronUp,
    ExternalLink, Lightbulb, Trophy, Target, Zap, Filter, X, Minus
} from 'lucide-react';
import { getChallengeProgresses, updateChallengeProgress } from '../../services/challengeService';
import IconButton from '../atoms/IconButton';

const PROCESS_STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Progressing', label: 'Đang thực hiện' },
    { value: 'Completed', label: 'Hoàn thành' },
];

const CHALLENGE_TYPE_OPTIONS = [
    { value: '', label: 'Tất cả loại' },
    { value: 'OneDayChallenge', label: '1 ngày' },
    { value: 'ThreeDayChallenge', label: '3 ngày' },
    { value: 'SevenDayChallenge', label: '7 ngày' },
];

// Cấu hình trạng thái
const STATUS_CONFIG = {
    NotStarted: { label: 'Chưa bắt đầu', color: 'gray', icon: null },
    Progressing: { label: 'Đang làm', color: 'yellow', icon: <div className="w-2 h-2 bg-yellow-500 rounded-full" /> },
    Completed: { label: 'Hoàn thành', color: 'green', icon: <Check className="w-3 h-3" /> },
    Skipped: { label: 'Bỏ qua', color: 'red', icon: <Minus className="w-3 h-3" /> },
};

const STATUS_CYCLE = ['NotStarted', 'Progressing', 'Completed', 'Skipped'];

const TaskTimeline = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const challengeIdFromUrl = searchParams.get('challengeId');

    const [challengeProgresses, setChallengeProgresses] = useState([]);
    const [expandedChallenges, setExpandedChallenges] = useState(new Set());
    const [expandedDays, setExpandedDays] = useState(new Set());
    const [expandedTask, setExpandedTask] = useState(null); // Không sử dụng nữa        
    const [updatingTasks, setUpdatingTasks] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showByChallenge, setShowByChallenge] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [processStatus, setProcessStatus] = useState('');
    const [challengeType, setChallengeType] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchChallengeProgresses();
    }, [processStatus, challengeType]);

    // Auto-expand challenge from URL
    useEffect(() => {
        if (challengeIdFromUrl && challengeProgresses.length > 0) {
            // Set showByChallenge to true
            setShowByChallenge(true);
            // Expand the challenge
            setExpandedChallenges(prev => new Set([...prev, challengeIdFromUrl]));
            // Scroll to the challenge after a short delay
            setTimeout(() => {
                const element = document.querySelector(`[data-challenge-id="${challengeIdFromUrl}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }
    }, [challengeIdFromUrl, challengeProgresses]);

    const fetchChallengeProgresses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getChallengeProgresses(
                processStatus || null,
                challengeType || null,
                1,
                100,
                'vi'
            );
            setChallengeProgresses(response.data || []);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Không thể tải dữ liệu.');
        } finally {
            setLoading(false);
            // Only reset expanded challenges if there's no challengeId from URL
            if (!challengeIdFromUrl) {
                setExpandedChallenges(new Set());
                setExpandedDays(new Set());
            }
        }
    };

    // Cập nhật trạng thái
    const updateTaskStatus = async (progressId, stepId, newStatus, dayNumber, startDate) => {
        const taskKey = `${progressId}-${stepId}`;
        setUpdatingTasks(prev => new Set([...prev, taskKey]));

        try {
            await updateChallengeProgress(progressId, stepId, newStatus, null);

            setChallengeProgresses(prev =>
                prev.map(cp =>
                    cp.id === progressId
                        ? {
                            ...cp,
                            steps: cp.steps.map(s =>
                                s.stepId === stepId ? { ...s, processStatus: newStatus } : s
                            ),
                        }
                        : cp
                )
            );
        } catch (err) {
            // Nếu API trả về 500, có thể là do cập nhật step của ngày khác
            const statusCode = err.response?.status || err.status;
            if (statusCode === 500) {
                window.dispatchEvent(new CustomEvent('app:toast', {
                    detail: {
                        type: 'warning',
                        title: 'Thông báo',
                        message: 'Hoạt động này chưa bắt đầu',
                        duration: 3000
                    }
                }));
            } else {
                window.dispatchEvent(new CustomEvent('app:toast', {
                    detail: {
                        type: 'error',
                        title: 'Lỗi',
                        message: 'Cập nhật thất bại',
                        duration: 3000
                    }
                }));
            }
            console.error(err);
        } finally {
            setUpdatingTasks(prev => {
                const newSet = new Set(prev);
                newSet.delete(taskKey);
                return newSet;
            });
        }
    };

    // Lấy trạng thái tiếp theo
    const getNextStatus = (currentStatus) => {
        const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
        return STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    };

    const toggleChallenge = (id) => {
        setExpandedChallenges(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const toggleDay = (key) => {
        setExpandedDays(prev => {
            const newSet = new Set(prev);
            newSet.has(key) ? newSet.delete(key) : newSet.add(key);
            return newSet;
        });
    };

    const toggleTask = (key) => {
        setExpandedTask(prev => (prev === key ? null : key));
    };

    const groupedByDate = useMemo(() => {
        const groups = {};
        challengeProgresses.forEach(cp => {
            cp.steps.forEach(step => {
                const startDate = new Date(cp.startDate);
                const taskDate = new Date(startDate);
                taskDate.setDate(startDate.getDate() + (step.dayNumber - 1));
                const dateKey = taskDate.toISOString().split('T')[0];
                if (!groups[dateKey]) groups[dateKey] = [];
                groups[dateKey].push({ ...step, challengeProgress: cp });
            });
        });
        return groups;
    }, [challengeProgresses]);

    const filteredDates = useMemo(() => {
        const dates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
        return selectedDate ? dates.filter(d => d === selectedDate) : dates;
    }, [groupedByDate, selectedDate]);

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredChallenges = useMemo(() => {
        if (!selectedDate) return challengeProgresses;
        return challengeProgresses.filter(cp => {
            return cp.steps.some(step => {
                const startDate = new Date(cp.startDate);
                const taskDate = new Date(startDate);
                taskDate.setDate(startDate.getDate() + (step.dayNumber - 1));
                return taskDate.toISOString().split('T')[0] === selectedDate;
            });
        });
    }, [challengeProgresses, selectedDate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent mx-auto mb-3"></div>
                    <p className="text-sm text-slate-300">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <p className="text-sm text-slate-200 mb-4">{error}</p>
                    <button
                        onClick={fetchChallengeProgresses}
                        className="px-4 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-400 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 border-b border-white/10 backdrop-blur sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">Lịch hoạt động</h1>
                            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">Theo dõi tiến độ hàng ngày</p>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-3`}>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    // Reset status filter when switching from "Theo thử thách" to "Theo ngày"
                                    if (showByChallenge) {
                                        setProcessStatus('');
                                    }
                                    setShowByChallenge(!showByChallenge);
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${showByChallenge
                                    ? 'bg-sky-500/20 text-sky-200 border border-sky-400/50'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {showByChallenge ? <Target className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                <span className="hidden sm:inline">{showByChallenge ? 'Theo ngày' : 'Theo thử thách'}</span>
                            </button>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-sky-500"
                            />
                            {showByChallenge && (
                                <select
                                    value={processStatus}
                                    onChange={(e) => setProcessStatus(e.target.value)}
                                    className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-sky-500"
                                >
                                    {PROCESS_STATUS_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}

                            <select
                                value={challengeType}
                                onChange={(e) => setChallengeType(e.target.value)}
                                className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-sky-500"
                            >
                                {CHALLENGE_TYPE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>



                            {(processStatus || challengeType || selectedDate) && (
                                <button
                                    onClick={() => {
                                        setProcessStatus('');
                                        setChallengeType('');
                                        setSelectedDate('');
                                    }}
                                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                {(showByChallenge ? filteredChallenges.length === 0 : filteredDates.length === 0) && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-300 text-sm">Chưa có hoạt động nào</p>
                        <p className="text-xs text-slate-500 mt-1">Thay đổi bộ lọc hoặc bắt đầu thử thách mới</p>
                    </div>
                )}

                {/* === THEO THỬ THÁCH === */}
                {showByChallenge && filteredChallenges.map(cp => {
                    const totalSteps = cp.steps.length;
                    const completedSteps = cp.steps.filter(s => s.processStatus === 'Completed').length;
                    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                    const isExpanded = expandedChallenges.has(cp.id);

                    const stepsByDay = {};
                    cp.steps.forEach(step => {
                        const startDate = new Date(cp.startDate);
                        const taskDate = new Date(startDate);
                        taskDate.setDate(startDate.getDate() + (step.dayNumber - 1));
                        const dayKey = taskDate.toISOString().split('T')[0];
                        if (!stepsByDay[dayKey]) stepsByDay[dayKey] = [];
                        stepsByDay[dayKey].push(step);
                    });

                    return (
                        <div key={cp.id} className="mb-6" data-challenge-id={cp.id}>
                            <div
                                className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer hover:border-sky-400 hover:shadow-sky-500/20 transition"
                                onClick={() => toggleChallenge(cp.id)}
                            >
                                <div className="flex items-start gap-3 ">
                                    <div className="flex w-12 h-12 md:w-16 md:h-16 rounded-lg items-center justify-center flex-shrink-0 overflow-hidden">
                                        <img
                                            src={cp.challengeMediaUrl || "https://media-emoease.b-cdn.net/WellnessModule/bf9f6ce4-6d85-4702-830c-2c30ac310fc0/original/wellbeingselfcare.webp"}
                                            alt={cp.challengeTitle}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://media-emoease.b-cdn.net/WellnessModule/bf9f6ce4-6d85-4702-830c-2c30ac310fc0/original/wellbeingselfcare.webp";
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 text-white">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">{cp.challengeTitle}</h3>
                                                <p className="text-xs text-slate-300 mt-0.5">{cp.challengeDescription || 'Thử thách hàng ngày'}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-sm font-semibold">{completedSteps}/{totalSteps}</span>
                                                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                            </div>
                                        </div>
                                        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isExpanded && Object.entries(stepsByDay).sort(([a], [b]) => new Date(a) - new Date(b)).map(([dateKey, steps]) => {
                                const date = new Date(dateKey);
                                const dayKey = `${cp.id}-${dateKey}`;
                                const isDayExpanded = expandedDays.has(dayKey);

                                return (
                                    <div key={dayKey} className="ml-4 sm:ml-6 mt-3">
                                        <div className="flex items-center gap-2 mb-2 cursor-pointer py-1" onClick={() => toggleDay(dayKey)}>
                                            <span className="text-sm font-medium text-white">
                                                {date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
                                            </span>
                                            {isDayExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>

                                        {isDayExpanded && (
                                            <div className="space-y-2 ml-2 sm:ml-4">
                                                {steps.sort((a, b) => a.orderIndex - b.orderIndex).map(step => {
                                                    const taskKey = `${cp.id}-${step.stepId}`;
                                                    const isTaskExpanded = expandedTask === taskKey;
                                                    const status = step.processStatus;
                                                    const config = STATUS_CONFIG[status];
                                                    let instructionsData = null;
                                                    if (step.activity?.instructions) {
                                                        try {
                                                            instructionsData = JSON.parse(step.activity.instructions.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim());
                                                        } catch (e) { }
                                                    }

                                                    return (
                                                        <div key={taskKey} className={`rounded-lg border transition ${status === 'Completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                                                            <div className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => toggleTask(taskKey)}>
                                                                {/* Checkbox 4 trạng thái */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const nextStatus = getNextStatus(status);
                                                                        updateTaskStatus(cp.id, step.stepId, nextStatus, step.dayNumber, cp.startDate);
                                                                    }}
                                                                    disabled={updatingTasks.has(`${cp.id}-${step.stepId}`)}
                                                                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
                                                                        ${status === 'NotStarted' ? 'border-gray-300 dark:border-gray-600' : ''}
                                                                        ${status === 'Progressing' ? 'border-yellow-500 bg-yellow-500' : ''}
                                                                        ${status === 'Completed' ? 'border-green-500 bg-green-500 text-white' : ''}
                                                                        ${status === 'Skipped' ? 'border-red-500 bg-red-500 text-white' : ''}
                                                                        ${updatingTasks.has(`${cp.id}-${step.stepId}`) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                                                                    `}
                                                                >
                                                                    {config.icon}
                                                                </button>

                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className={`text-sm font-medium text-white`}>
                                                                        {step.activity?.name}
                                                                    </h5>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{step.activity?.description}</p>
                                                                    <span className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                                                                        <Clock className="w-3 h-3" /> {step.activity?.duration || 10}p
                                                                    </span>
                                                                </div>
                                                                {instructionsData && (isTaskExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />)}
                                                            </div>

                                                            {/* Chi tiết */}
                                                            {isTaskExpanded && instructionsData && (
                                                                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 space-y-6">
                                                                    {Object.entries(instructionsData).map(([guideKey, guide]) => (
                                                                        <div key={guideKey}>
                                                                            {guide.visualization && (
                                                                                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                                                                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                                                    <p className="text-sm italic text-blue-800 dark:text-blue-200">
                                                                                        <strong>Hình dung:</strong> {guide.visualization}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            {guide.instructions && Array.isArray(guide.instructions) && (
                                                                                <div>
                                                                                    <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
                                                                                        Hướng dẫn thực hiện:
                                                                                    </h5>
                                                                                    <ol className="space-y-3">
                                                                                        {guide.instructions.map((step, i) => (
                                                                                            <li key={i} className="flex gap-3">
                                                                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-bold">
                                                                                                    {step.step}
                                                                                                </span>
                                                                                                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                                                                                    {step.description}
                                                                                                    {step.url && step.url.trim() && (
                                                                                                        <a
                                                                                                            href={step.url}
                                                                                                            target="_blank"
                                                                                                            rel="noopener noreferrer"
                                                                                                            className="inline-flex items-center gap-1 ml-2 text-purple-600 hover:underline"
                                                                                                            onClick={e => e.stopPropagation()}
                                                                                                        >
                                                                                                            Xem thêm <ExternalLink className="h-3 w-3" />
                                                                                                        </a>
                                                                                                    )}
                                                                                                </p>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ol>
                                                                                </div>
                                                                            )}

                                                                            {guide.motivation && (
                                                                                <div className="space-y-3">
                                                                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                                                                        {guide.motivation.description}
                                                                                    </p>
                                                                                    {guide.motivation.research?.findings && (
                                                                                        <div className="text-xs space-y-1">
                                                                                            {guide.motivation.research.findings.map((f, i) => (
                                                                                                <p key={i} className="text-gray-600 dark:text-gray-400">• {f}</p>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                    {guide.motivation.research?.source && (
                                                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                                            {guide.motivation.research.source.map((src, i) => (
                                                                                                <a
                                                                                                    key={i}
                                                                                                    href={src.link}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
                                                                                                    onClick={e => e.stopPropagation()}
                                                                                                >
                                                                                                    {src.name}
                                                                                                </a>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}

                                                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                                        {STATUS_CYCLE.map(st => (
                                                                            <button
                                                                                key={st}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    updateTaskStatus(cp.id, step.stepId, st, step.dayNumber, cp.startDate);
                                                                                }}
                                                                                disabled={updatingTasks.has(`${cp.id}-${step.stepId}`)}
                                                                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${status === st
                                                                                    ? 'bg-purple-600 text-white'
                                                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                                                                                    } ${updatingTasks.has(`${cp.id}-${step.stepId}`) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                            >
                                                                                {STATUS_CONFIG[st].label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {/* === THEO NGÀY === */}
                {!showByChallenge && filteredDates.map(dateKey => {
                    const date = new Date(dateKey);
                    const isToday = dateKey === todayStr;

                    return (
                        <div key={dateKey} className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className={`text-base font-semibold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                                    {date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })}
                                </h3>
                                {isToday && <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">Hôm nay</span>}
                            </div>

                            <div className="space-y-2">
                                {groupedByDate[dateKey].sort((a, b) => a.orderIndex - b.orderIndex).map((item, idx) => {
                                    const task = item;
                                    const cp = item.challengeProgress;
                                    const taskKey = `${dateKey}-${idx}`;
                                    const isExpanded = expandedTask === taskKey;
                                    const status = task.processStatus;
                                    const config = STATUS_CONFIG[status];
                                    let instructionsData = null;
                                    if (task.activity?.instructions) {
                                        try {
                                            instructionsData = JSON.parse(task.activity.instructions.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim());
                                        } catch (e) { }
                                    }

                                    return (
                                        <div key={taskKey} className={`rounded-lg border transition ${status === 'Completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'}`}>
                                            <div className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => toggleTask(taskKey)}>
                                                {/* Checkbox 4 trạng thái */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const nextStatus = getNextStatus(status);
                                                        updateTaskStatus(cp.id, task.stepId, nextStatus, task.dayNumber, cp.startDate);
                                                    }}
                                                    disabled={updatingTasks.has(`${cp.id}-${task.stepId}`)}
                                                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0
                                                        ${status === 'NotStarted' ? 'border-gray-300 dark:border-gray-600' : ''}
                                                        ${status === 'Progressing' ? 'border-yellow-500 bg-yellow-500' : ''}
                                                        ${status === 'Completed' ? 'border-green-500 bg-green-500 text-white' : ''}
                                                        ${status === 'Skipped' ? 'border-red-500 bg-red-500 text-white' : ''}
                                                        ${updatingTasks.has(`${cp.id}-${task.stepId}`) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                                                    `}
                                                >
                                                    {config.icon}
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <h5 className={`text-sm font-medium text-white`}>
                                                        {task.activity?.name}
                                                    </h5>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{task.activity?.description}</p>
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium">{cp.title}</span>
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Clock className="w-3 h-3" /> Ngày {task.dayNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                {instructionsData && (isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />)}
                                            </div>

                                            {/* Chi tiết */}
                                            {isExpanded && instructionsData && (
                                                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 space-y-6">
                                                    {Object.entries(instructionsData).map(([guideKey, guide]) => (
                                                        <div key={guideKey}>
                                                            {guide.visualization && (
                                                                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                                                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                                    <p className="text-sm italic text-blue-800 dark:text-blue-200">
                                                                        <strong>Hình dung:</strong> {guide.visualization}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {guide.instructions && Array.isArray(guide.instructions) && (
                                                                <div>
                                                                    <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
                                                                        Hướng dẫn thực hiện:
                                                                    </h5>
                                                                    <ol className="space-y-3">
                                                                        {guide.instructions.map((step, i) => (
                                                                            <li key={i} className="flex gap-3">
                                                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-bold">
                                                                                    {step.step}
                                                                                </span>
                                                                                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                                                                    {step.description}
                                                                                    {step.url && step.url.trim() && (
                                                                                        <a
                                                                                            href={step.url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="inline-flex items-center gap-1 ml-2 text-purple-600 hover:underline"
                                                                                            onClick={e => e.stopPropagation()}
                                                                                        >
                                                                                            Xem thêm <ExternalLink className="h-3 w-3" />
                                                                                        </a>
                                                                                    )}
                                                                                </p>
                                                                            </li>
                                                                        ))}
                                                                    </ol>
                                                                </div>
                                                            )}

                                                            {guide.motivation && (
                                                                <div className="space-y-3">
                                                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                                                        {guide.motivation.description}
                                                                    </p>
                                                                    {guide.motivation.research?.findings && (
                                                                        <div className="text-xs space-y-1">
                                                                            {guide.motivation.research.findings.map((f, i) => (
                                                                                <p key={i} className="text-gray-600 dark:text-gray-400">• {f}</p>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {guide.motivation.research?.source && (
                                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                            {guide.motivation.research.source.map((src, i) => (
                                                                                <a
                                                                                    key={i}
                                                                                    href={src.link}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
                                                                                    onClick={e => e.stopPropagation()}
                                                                                >
                                                                                    {src.name}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        {STATUS_CYCLE.map(st => {
                                                            const activeColorMap = {
                                                                NotStarted: 'bg-gray-400 text-white',
                                                                Progressing: 'bg-yellow-500 text-white',
                                                                Completed: 'bg-green-500 text-white',
                                                                Skipped: 'bg-red-500 text-white',
                                                            };

                                                            const inactiveColor =
                                                                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600';

                                                            const isActive = status === st;

                                                            return (
                                                                <button
                                                                    key={st}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateTaskStatus(cp.id, task.stepId, st, task.dayNumber, cp.startDate);
                                                                    }}
                                                                    disabled={updatingTasks.has(`${cp.id}-${task.stepId}`)}
                                                                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-300
          ${isActive ? activeColorMap[st] : inactiveColor}
          ${updatingTasks.has(`${cp.id}-${task.stepId}`) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                >
                                                                    {STATUS_CONFIG[st].label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskTimeline;