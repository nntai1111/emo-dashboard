import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarouselSection from '../components/organisms/CarouselSection';
import ChallengeList from '../components/organisms/ChallengeList';
import ChallengeHubTemplate from '../components/templates/ChallengeHubTemplate';
import { getChallenges } from '../services/challengeService';

// Mapping functions
const mapDurationToChallengeType = (duration) => {
    const mapping = {
        '1 Day': 'OneDayChallenge',
        '3 Days': 'ThreeDayChallenge',
        '7 Days': 'SevenDayChallenge',
    };
    return mapping[duration] || null;
};

const mapCategoryToImprovementTag = (category) => {
    const mapping = {
        'Mental Health': 'MentalHealth',
        'Physical Balance': 'PhysicalBalance',
        'PhysicalBalance': 'PhysicalBalance', // Support both formats
        'Social Connection': 'SocialConnection',
        'SocialConnection': 'SocialConnection', // Support both formats
        'Creative Relaxation': 'CreativeRelaxation',
        'Combined': 'Combined',
    };
    return mapping[category] || null;
};

// Reverse mapping functions for URL params
const mapChallengeTypeToDuration = (challengeType) => {
    const mapping = {
        'OneDayChallenge': '1 Day',
        'ThreeDayChallenge': '3 Days',
        'SevenDayChallenge': '7 Days',
    };
    return mapping[challengeType] || '';
};

const mapImprovementTagToCategory = (improvementTag) => {
    const mapping = {
        'MentalHealth': 'Mental Health',
        'PhysicalBalance': 'Physical Balance',
        'SocialConnection': 'Social Connection',
        'CreativeRelaxation': 'Creative Relaxation',
        'Combined': 'Combined',
    };
    return mapping[improvementTag] || '';
};

// Transform API data
const transformChallengeData = (apiChallenge) => {
    const challengeTypeToDuration = {
        'OneDayChallenge': '1 Day',
        'ThreeDayChallenge': '3 Days',
        'SevenDayChallenge': '7 Days',
    };

    return {
        id: apiChallenge.id,
        title: apiChallenge.title,
        description: apiChallenge.description,
        category: 'Meditation', // Có thể cần cập nhật sau nếu API có field
        duration: challengeTypeToDuration[apiChallenge.challengeType] || '1 Day',
        image: apiChallenge.mediaUrl,
        hasAccess: apiChallenge.hasAccess !== false, // Default to true if not specified, only lock if explicitly false
        _original: apiChallenge,
    };
};

const ChallengeHubPage = () => {
    const [searchParams] = useSearchParams();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Get query parameters from URL
    const challengeTypeParam = searchParams.get('ChallengeType') || null;
    const improvementTagParam = searchParams.get('ImprovementTag') || null;
    const pageIndexParam = parseInt(searchParams.get('PageIndex') || '1', 10);
    const pageSizeParam = parseInt(searchParams.get('PageSize') || '10', 10);
    const targetLangParam = searchParams.get('TargetLang') || 'vi';

    // Map URL params to UI filter values
    const mappedDurationFilter = challengeTypeParam ? mapChallengeTypeToDuration(challengeTypeParam) : '';
    const mappedCategoryFilter = improvementTagParam ? mapImprovementTagToCategory(improvementTagParam) : '';

    const [durationFilter, setDurationFilter] = useState(mappedDurationFilter);
    const [categoryFilter, setCategoryFilter] = useState(mappedCategoryFilter);

    // Update filters when URL params change
    useEffect(() => {
        const newDurationFilter = challengeTypeParam ? mapChallengeTypeToDuration(challengeTypeParam) : '';
        const newCategoryFilter = improvementTagParam ? mapImprovementTagToCategory(improvementTagParam) : '';
        setDurationFilter(newDurationFilter);
        setCategoryFilter(newCategoryFilter);
    }, [challengeTypeParam, improvementTagParam]);

    // Fetch challenges when filters or URL params change
    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true);
            setError(null);

            try {
                // Use URL params if available, otherwise use UI filters
                const challengeType = challengeTypeParam || (durationFilter ? mapDurationToChallengeType(durationFilter) : null);
                const improvementTag = improvementTagParam || (categoryFilter ? mapCategoryToImprovementTag(categoryFilter) : null);

                const response = await getChallenges(
                    challengeType,
                    improvementTag,
                    pageIndexParam,
                    pageSizeParam,
                    targetLangParam
                );
                const transformedChallenges = (response.data || []).map(transformChallengeData);
                setChallenges(transformedChallenges);
            } catch (err) {
                console.error('Error fetching challenges:', err);
                setError(err.message || 'Failed to load challenges');
                setChallenges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [durationFilter, categoryFilter, challengeTypeParam, improvementTagParam, pageIndexParam, pageSizeParam, targetLangParam]);

    const handleDurationChange = (e) => {
        const value = e.target.value;
        setDurationFilter(value === '' ? '' : value);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategoryFilter(value === '' ? '' : value);
    };

    const clearFilters = () => {
        setDurationFilter('');
        setCategoryFilter('');
    };

    if (loading) {
        return (
            <div className="w-full h-full bg-black overflow-y-auto flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-200">Đang tải thử thách...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-black overflow-y-auto flex items-center justify-center text-white">
                <div className="text-center">
                    <p className="text-red-400 mb-4">Lỗi: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black text-white overflow-y-auto">
            <ChallengeHubTemplate
                filterChips={null} // Không dùng chip nữa
                filterSection={
                    <div className="inline-flex items-center gap-4 mb-6">
                        {/* Duration */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-300 mb-1 uppercase tracking-wide">Thời lượng</label>
                            <select
                                value={durationFilter}
                                onChange={handleDurationChange}
                                className="px-3 py-1.5 w-40 border border-white/10 bg-[#0f172a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg transition"
                            >
                                <option value="">Tất cả thời lượng</option>
                                <option value="1 Day">1 Ngày</option>
                                <option value="3 Days">3 Ngày</option>
                                <option value="7 Days">7 Ngày</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-slate-300 mb-1 uppercase tracking-wide">Danh mục</label>
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                className="px-3 py-1.5 w-48 border border-white/10 bg-[#0f172a] text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg transition"
                            >
                                <option value="">Tất cả danh mục</option>
                                <option value="Mental Health">Sức khỏe tinh thần</option>
                                <option value="Physical Balance">Cân bằng thể chất</option>
                                <option value="Social Connection">Kết nối xã hội</option>
                                <option value="Creative Relaxation">Thư giãn sáng tạo</option>
                                <option value="Combined">Kết hợp</option>
                            </select>
                        </div>

                        {/* Clear */}
                        {(durationFilter || categoryFilter) && (
                            <button
                                onClick={clearFilters}
                                className="ml-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                }

                carouselSection={
                    <CarouselSection
                        challenges={challenges}
                        carouselIndex={carouselIndex}
                        setCarouselIndex={setCarouselIndex}
                    />
                }
                challengeList={<ChallengeList challenges={challenges} />}
            />
        </div>
    );
};

export default ChallengeHubPage;