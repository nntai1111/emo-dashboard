import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import KnowledgeBreadcrumb from "../components/molecules/KnowledgeBreadcrumb";
import HeroSection from "../components/molecules/HeroSection";
import ArticleList from "../components/molecules/ArticleList";
import ArticleCard from "../components/atoms/ArticleCard";
import Button from "../components/atoms/Button";
import { getModuleSectionsByCategory, getSectionDetail } from "../services/wellnessService";
import { motion } from "framer-motion";

// Valid categories
const VALID_CATEGORIES = [
    "OvercomeAnxiety",
    "ManageDepression",
    "BuildSelfWorth",
    "ManageStress",
    "ImproveSleep",
    "HealSelfHarm",
    "BoostRelationships",
    "PracticeMindfulness",
];

// Category display names
const CATEGORY_NAMES = {
    OvercomeAnxiety: "Vượt qua Lo âu",
    ManageDepression: "Quản lý Trầm cảm",
    BuildSelfWorth: "Xây dựng Giá trị Bản thân",
    ManageStress: "Quản lý Căng thẳng",
    ImproveSleep: "Cải thiện Giấc ngủ",
    HealSelfHarm: "Chữa lành Tự làm hại",
    BoostRelationships: "Tăng cường Mối quan hệ",
    PracticeMindfulness: "Thực hành Chánh niệm",
};

// Loading spinner component
const LoadingSpinner = ({ text = "Đang tải..." }) => (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
        {text && <p className="text-purple-300 text-sm font-medium">{text}</p>}
    </div>
);

const CategoryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Parse category from URL format: ?=ManageDepression
    // Also support: ?category=ManageDepression (backward compatibility)
    const getCategoryFromUrl = () => {
        const search = location.search;
        if (!search || search === '?') return null;

        // Handle format: ?=ManageDepression
        // location.search will be "?=ManageDepression"
        if (search.startsWith('?=')) {
            const categoryValue = search.substring(2); // Remove '?='
            // Decode URL encoding if any
            return decodeURIComponent(categoryValue);
        }

        // Handle format: ?category=ManageDepression (backward compatibility)
        try {
            const params = new URLSearchParams(search);
            // Try to get category parameter first
            const categoryParam = params.get('category');
            if (categoryParam) return categoryParam;

            // If no category param, try to get first value (for ?=value format that might be parsed differently)
            const firstKey = Array.from(params.keys())[0];
            if (firstKey === '' || !firstKey) {
                // Try to get empty string key value
                const emptyKeyValue = params.get('');
                if (emptyKeyValue) return emptyKeyValue;
            }
        } catch (err) {
            console.warn("Error parsing URL params:", err);
        }

        return null;
    };

    const category = getCategoryFromUrl();
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingSectionDetail, setLoadingSectionDetail] = useState(false);
    const [error, setError] = useState(null);
    const { setBreadcrumb } = useBreadcrumb();

    // Validate category
    useEffect(() => {
        console.log("🔍 Category from URL:", category);
        if (!category || !VALID_CATEGORIES.includes(category)) {
            console.warn("⚠️ Invalid or missing category:", category);
            setError(`Category không hợp lệ hoặc không được cung cấp. Category hợp lệ: ${VALID_CATEGORIES.join(", ")}`);
            setLoading(false);
        } else {
            console.log("✅ Valid category:", category);
            setError(null);
        }
    }, [category]);

    // Load sections by category
    useEffect(() => {
        if (!category || !VALID_CATEGORIES.includes(category)) {
            return;
        }

        const fetchSections = async () => {
            try {
                setLoadingSections(true);
                console.log("🔍 Fetching sections for category:", category);
                const res = await getModuleSectionsByCategory(category, undefined, 1, 10, "vi");
                console.log("📦 API Response:", res);
                const sectionData = res.data || [];
                console.log("📋 Section data:", sectionData);

                const mappedSections = sectionData.map((s) => {
                    let percent = 0;
                    if (s.processStatus === "Completed") {
                        percent = 100;
                    } else if (s.processStatus === "InProgress" && s.totalDuration > 0) {
                        percent = Math.round((s.completedDuration || 0) / s.totalDuration * 100);
                    }

                    return {
                        id: s.id,
                        name: s.title,
                        imageURL: s.mediaUrl || s.meidaUrl,
                        description: s.description,
                        totalDuration: s.totalDuration,
                        completedDuration: s.completedDuration || 0,
                        percent,
                        articleCount: s.articleCount,
                    };
                });

                console.log("✅ Mapped sections:", mappedSections);
                setSections(mappedSections);
            } catch (err) {
                console.error("❌ Error fetching sections:", err);
                console.error("Error details:", err.response?.data || err.message);
                setError(`Không thể tải nội dung mô-đun: ${err.message || "Lỗi không xác định"}`);
            } finally {
                setLoadingSections(false);
                setLoading(false);
            }
        };

        fetchSections();
    }, [category]);

    // Update breadcrumb
    useEffect(() => {
        setBreadcrumb({
            category: category ? CATEGORY_NAMES[category] || category : null,
            topic: selectedSection?.title || null,
            article: selectedArticle?.title || null,
        });
    }, [category, selectedSection, selectedArticle, setBreadcrumb]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [selectedSection, selectedArticle]);

    const handleNavigate = (level) => {
        if (level === "home" || level === "root") {
            // Navigate back to home or wellness page
            navigate("/space/knowledge");
        } else if (level === "category") {
            // Go back to category section list (reset section and article)
            setSelectedSection(null);
            setSelectedArticle(null);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (level === "topic") {
            // Go back to section article list (reset article only)
            setSelectedArticle(null);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const scrollToCategories = (e) => {
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }
        const el = document.querySelector(".category-section");
        if (!el) return;

        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    const renderArticleDetail = () => {
        if (!selectedArticle) return null;

        const articles = selectedSection?.articles || [];
        const currentIndex = articles.findIndex(a => a.id === selectedArticle.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < articles.length - 1;

        const handlePrevArticle = () => {
            if (hasPrev) {
                setSelectedArticle(articles[currentIndex - 1]);
            }
        };

        const handleNextArticle = () => {
            if (hasNext) {
                setSelectedArticle(articles[currentIndex + 1]);
            }
        };

        let contentBlocks = [];
        try {
            if (typeof selectedArticle.content === 'string') {
                contentBlocks = JSON.parse(selectedArticle.content);
            } else if (Array.isArray(selectedArticle.content)) {
                contentBlocks = selectedArticle.content;
            }
        } catch (err) {
            console.error("Lỗi parse content:", err);
        }

        const imageSrc = selectedArticle.mediaUrl || selectedSection?.mediaUrl || selectedSection?.imageURL;

        return (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-4 md:p-8 mt-8 border border-[#8131ad]/20">
                {articles.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600">
                            Bài {currentIndex + 1} / {articles.length} - {selectedSection?.title}
                        </p>
                    </div>
                )}

                <h2 className="text-2xl font-sans font-bold mb-4 text-[#8131ad] text-center">
                    {selectedArticle.title}
                </h2>
                {imageSrc ? (
                    <div className="flex justify-center mb-6">
                        <img
                            src={imageSrc}
                            alt={selectedArticle.title}
                            className="w-full max-w-full sm:max-w-[600px] h-auto sm:max-h-[400px] object-contain rounded-xl shadow-lg"
                        />
                    </div>
                ) : null}
                <p className="text-sm mb-2 font-sans text-indigo-600 font-medium">
                    {selectedArticle.articleSource?.name && `Tác giả: ${selectedArticle.articleSource.name} | `}
                    {selectedArticle.duration && `Thời lượng: ${selectedArticle.duration} phút`}
                </p>


                <div className="prose prose-lg max-w-none font-sans text-gray-600 space-y-4 mt-6">
                    {contentBlocks.map((block, idx) => {
                        if (block.block_type === "header") {
                            const Tag = `h${block.content_json.level}`;
                            const headerClasses = {
                                1: "text-3xl",
                                2: "text-2xl",
                                3: "text-xl",
                                4: "text-lg"
                            };
                            const headerColors = {
                                1: "text-[#8131ad]",
                                2: "text-[#9c72d9]",
                                3: "text-slate-800",
                                4: "text-slate-600"
                            };
                            return (
                                <Tag
                                    key={idx}
                                    className={`${headerColors[block.content_json.level] || "text-gray-800"} font-bold mt-6 mb-4 ${headerClasses[block.content_json.level] || "text-xl"}`}
                                >
                                    {block.content_json.text}
                                </Tag>
                            );
                        }
                        if (block.block_type === "paragraph") {
                            return <p key={idx} className="leading-relaxed">{block.content_json.text}</p>;
                        }
                        if (block.block_type === "list") {
                            const ListTag = block.content_json.style === "ordered" ? "ol" : "ul";
                            return (
                                <ListTag
                                    key={idx}
                                    className={`${block.content_json.style === "ordered" ? "list-decimal" : "list-disc"} pl-6 space-y-2`}
                                >
                                    {block.content_json.items.map((item, i) => (
                                        <li key={i} className="leading-relaxed">{item}</li>
                                    ))}
                                </ListTag>
                            );
                        }
                        return null;
                    })}
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={() => setSelectedArticle(null)}
                        className="mr-auto"
                    >
                        Quay lại danh sách
                    </Button>
                    <div className="flex gap-4">
                        {hasPrev && (
                            <Button
                                type="button"
                                onClick={handlePrevArticle}
                                className="bg-gray-600 hover:bg-gray-700"
                            >
                                ← Bài trước
                            </Button>
                        )}
                        {hasNext && (
                            <Button
                                type="button"
                                onClick={handleNextArticle}
                                className="bg-[#8131ad] hover:bg-[#6b2590]"
                            >
                                Bài tiếp theo →
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderSectionArticles = () => {
        if (!selectedSection || !selectedSection.articles) return null;

        const articles = selectedSection.articles || [];

        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
            >
                <HeroSection
                    title={selectedSection.title}
                    description={selectedSection.description}
                    img={selectedSection.mediaUrl || selectedSection.imageURL}
                    fullHeight={false}
                    whiteBackground
                    button={{
                        label: "Xem danh sách bài viết",
                        onClick: scrollToCategories,
                        animate: { y: [0, -10, 0] },
                        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                />
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-orange-200 flex items-center justify-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M5 4h14v2H5zM5 8h14v2H5zM5 12h10v2H5zM5 16h10v2H5z" />
                            </svg>
                        </span>
                        Danh sách bài viết
                    </h2>
                    <p className="text-gray-300 mt-2">
                        {selectedSection.articleCount || articles.length} bài viết •
                        Tổng thời lượng: {selectedSection.totalDuration} phút
                    </p>
                </div>
                <section className="category-section w-full max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        {articles.map((article, index) => {
                            let description = article.title;
                            try {
                                if (article.content) {
                                    const contentBlocks = typeof article.content === 'string'
                                        ? JSON.parse(article.content)
                                        : article.content;
                                    if (Array.isArray(contentBlocks) && contentBlocks.length > 0) {
                                        const firstBlock = contentBlocks[0];
                                        if (firstBlock.block_type === 'paragraph' && firstBlock.content_json?.text) {
                                            description = firstBlock.content_json.text.substring(0, 150);
                                            if (firstBlock.content_json.text.length > 150) {
                                                description += '...';
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                description = article.title;
                            }

                            return (
                                <ArticleCard
                                    key={article.id}
                                    item={{
                                        id: article.id,
                                        name: article.title,
                                        title: article.title,
                                        imageURL: article.mediaUrl || selectedSection.mediaUrl,
                                        description: description,
                                        duration: article.duration,
                                        orderIndex: article.orderIndex || index + 1,
                                        completed: article.completed
                                    }}
                                    onClick={() => setSelectedArticle(article)}
                                    isModule={false}
                                />
                            );
                        })}
                    </div>
                </section>
                <Button onClick={() => setSelectedSection(null)} className="mt-6">
                    Quay lại danh sách bài học
                </Button>
            </motion.div>
        );
    };

    const renderSectionList = () => {
        const categoryName = category ? CATEGORY_NAMES[category] || category : "Danh mục";

        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center pb-8 md:pb-12"
            >
                <HeroSection
                    title={categoryName}
                    description={`Khám phá các bài học và bài viết về ${categoryName.toLowerCase()}`}
                    img="/knowledge/emo1c.png"
                    fullHeight={false}
                    compact
                    button={{
                        label: "Xem danh sách bài học",
                        onClick: scrollToCategories,
                        animate: { y: [0, -10, 0] },
                        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                />
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-orange-200 flex items-center justify-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M4 6h16v2H4zM4 10h16v2H4zM4 14h10v2H4z" />
                            </svg>
                        </span>
                        Danh sách bài học
                    </h2>
                </div>
                <section className="category-section w-full">
                    {loadingSections ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner text="Đang tải bài học..." />
                        </div>
                    ) : sections.length > 0 ? (
                        <ArticleList
                            modules={sections.map((s) => ({
                                id: s.id,
                                name: s.name,
                                imageURL: s.imageURL,
                                description: s.description,
                                totalDuration: s.totalDuration,
                                completedDuration: s.completedDuration,
                            }))}
                            onSelectModule={async (section) => {
                                try {
                                    setLoadingSectionDetail(true);

                                    const detail = await getSectionDetail(section.id, "vi");

                                    if (detail) {
                                        setSelectedSection({
                                            ...detail,
                                            id: detail.id,
                                            title: detail.title,
                                            mediaUrl: detail.mediaUrl,
                                            description: detail.description,
                                            totalDuration: detail.totalDuration,
                                            completedDuration: detail.completedDuration,
                                            completed: detail.completed,
                                            articleCount: detail.articleCount,
                                            articles: detail.articles || []
                                        });
                                    } else {
                                        setError("Không thể tải chi tiết bài học.");
                                    }
                                } catch (err) {
                                    console.error("Lỗi tải chi tiết bài học:", err);
                                    setError("Không thể tải chi tiết bài học.");
                                } finally {
                                    setLoadingSectionDetail(false);
                                }
                            }}
                        />
                    ) : (
                        <p className="text-center text-white">Chưa có bài học nào.</p>
                    )}
                </section>
            </motion.div>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <LoadingSpinner />
        </div>
    );
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600"><p>{error}</p></div>;

    // Get category name for breadcrumb
    const categoryName = category ? CATEGORY_NAMES[category] || category : null;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-2 px-6">
            <KnowledgeBreadcrumb
                category={categoryName}
                topic={selectedSection?.title || null}
                article={selectedArticle?.title || null}
                onNavigate={handleNavigate}
            />

            {/* Danh sách section */}
            {!selectedSection && !selectedArticle && renderSectionList()}

            {/* Danh sách articles trong section */}
            {selectedSection && !selectedArticle && renderSectionArticles()}

            {/* Loading section detail */}
            {loadingSectionDetail && (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <LoadingSpinner text="Đang tải chi tiết bài học..." />
                </div>
            )}

            {/* Chi tiết bài viết */}
            {selectedArticle && !loadingSectionDetail && renderArticleDetail()}
        </div>
    );
};

export default CategoryPage;

