
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import KnowledgeBreadcrumb from "../components/molecules/KnowledgeBreadcrumb";
import { useBreadcrumb } from "../contexts/BreadcrumbContext";
import HeroSection from "../components/molecules/HeroSection";
import ArticleList from "../components/molecules/ArticleList";
import ArticleCard from "../components/atoms/ArticleCard";
import Button from "../components/atoms/Button";
import CategoryList from "../components/molecules/CategoryList";
import UpgradeModal from "../components/molecules/UpgradeModal";
import { getWellnessModules, getModuleSections, getSectionDetail, trackArticleProgress, updateModuleProgress } from "../services/wellnessService";
import { motion } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

const ArticlesPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const hasAccess = useSelector((state) => state.auth.isOwner);
    const isMobile = useIsMobile();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sections, setSections] = useState([]); // Danh sách section
    const [selectedSection, setSelectedSection] = useState(null); // Section đang xem (full detail với articles)
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingSectionDetail, setLoadingSectionDetail] = useState(false);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState(new Set()); // Track expanded sections
    const [expandedArticles, setExpandedArticles] = useState(new Set()); // Track expanded articles
    const { setBreadcrumb } = useBreadcrumb();

    // Parse categoryId and sectionId from URL query params
    const categoryIdFromUrl = useMemo(() => {
        const query = new URLSearchParams(location.search);
        return query.get("categoryId");
    }, [location.search]);

    const sectionIdFromUrl = useMemo(() => {
        const query = new URLSearchParams(location.search);
        return query.get("sectionId");
    }, [location.search]);

    // Helper function để cache section vào localStorage
    const cacheSection = (sectionId, sectionData) => {
        try {
            const cacheKey = `wellness_section_${sectionId}`;
            localStorage.setItem(cacheKey, JSON.stringify({
                ...sectionData,
                cachedAt: new Date().toISOString()
            }));
        } catch (err) {
            console.error("Lỗi khi cache section:", err);
        }
    };

    // Helper function để lấy section từ cache
    const getCachedSection = (sectionId) => {
        try {
            const cacheKey = `wellness_section_${sectionId}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (err) {
            console.error("Lỗi khi đọc cache section:", err);
        }
        return null;
    };

    // Load danh sách module (category)
    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const res = await getWellnessModules(1, 20, "vi");
                const modules = res.data || [];

                const mapped = modules.map((m) => ({
                    id: m.id,
                    name: m.name,
                    imageURL: m.mediaUrl,
                    description: m.description,
                    sectionCount: m.sectionCount,
                }));

                setCategories(mapped);
            } catch (err) {
                setError("Không thể tải danh mục.");
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    // Auto-select category from URL query param
    useEffect(() => {
        if (categoryIdFromUrl && categories.length > 0 && !selectedCategory) {
            const category = categories.find(cat => cat.id === categoryIdFromUrl);
            if (category) {
                setSelectedCategory(category);
            }
        }
    }, [categoryIdFromUrl, categories, selectedCategory]);

    // Auto-select section from URL query param
    useEffect(() => {
        // Chỉ load section từ URL nếu:
        // 1. Có sectionId trong URL
        // 2. Chưa có selectedSection
        // 3. Không đang loading
        // 4. Không có selectedCategory (để tránh conflict khi đã chọn category rồi)
        if (sectionIdFromUrl && !selectedSection && !loading && !selectedCategory) {
            const loadSectionFromUrl = async () => {
                try {
                    setLoadingSectionDetail(true);
                    // Load section detail
                    const detail = await getSectionDetail(sectionIdFromUrl, "vi");

                    if (detail) {
                        // Tìm category chứa section này
                        // Cần load tất cả categories và tìm category có chứa section này
                        // Hoặc có thể lấy moduleId từ section detail nếu có
                        // Tạm thời, load tất cả categories và sections để tìm
                        const allCategories = await getWellnessModules(1, 20, "vi");
                        const categoriesData = allCategories.data || [];

                        // Tìm category chứa section này
                        let foundCategory = null;
                        for (const cat of categoriesData) {
                            try {
                                const sectionsRes = await getModuleSections(cat.id, 1, 100, "vi");
                                const sectionsData = sectionsRes.data || [];
                                const found = sectionsData.find(s => s.id === sectionIdFromUrl);
                                if (found) {
                                    foundCategory = {
                                        id: cat.id,
                                        name: cat.name,
                                        imageURL: cat.mediaUrl,
                                        description: cat.description,
                                        sectionCount: cat.sectionCount,
                                    };
                                    break;
                                }
                            } catch (err) {
                                console.error(`Error checking category ${cat.id}:`, err);
                            }
                        }

                        if (foundCategory) {
                            setSelectedCategory(foundCategory);
                            // Set selectedSection với full detail
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
                                articles: detail.articles || [],
                                processStatus: detail.processStatus || "NotStarted",
                            });
                        }
                    }
                } catch (err) {
                    console.error("Error loading section from URL:", err);
                } finally {
                    setLoadingSectionDetail(false);
                }
            };

            loadSectionFromUrl();
        }
    }, [sectionIdFromUrl, selectedSection, loading, selectedCategory]);

    // Reset expanded state khi chuyển category
    useEffect(() => {
        setExpandedSections(new Set());
    }, [selectedCategory]);

    // Reset expanded state khi chuyển section
    useEffect(() => {
        setExpandedArticles(new Set());
    }, [selectedSection]);

    // Load section khi chọn category
    useEffect(() => {
        if (!selectedCategory) {
            setSections([]);
            setSelectedSection(null);
            return;
        }

        const fetchSections = async () => {
            try {
                setLoadingSections(true);
                const res = await getModuleSections(selectedCategory.id, 1, 10, "vi");
                const sectionData = res.data || [];

                // Trong useEffect fetch sections
                const mappedSections = sectionData.map((s) => {
                    let percent = 0;
                    if (s.processStatus === "Completed") {
                        percent = 100;
                    } else if (s.totalDuration > 0) {
                        // Tính percent dựa trên completedDuration và totalDuration
                        percent = Math.round((s.completedDuration || 0) / s.totalDuration * 100);
                        // Đảm bảo percent không vượt quá 100
                        percent = Math.min(percent, 100);
                    }

                    return {
                        id: s.id,
                        name: s.title,
                        imageURL: s.mediaUrl || s.meidaUrl, // Support both spellings
                        description: s.description,
                        totalDuration: s.totalDuration,
                        completedDuration: s.completedDuration || 0,
                        percent,
                        articleCount: s.articleCount,
                        processStatus: s.processStatus, // Lưu processStatus để check lần đầu đọc
                    };
                });

                setSections(mappedSections);

            } catch (err) {
                console.error(err);
                setError("Không thể tải nội dung mô-đun.");
            } finally {
                setLoadingSections(false);
            }
        };

        fetchSections();
    }, [selectedCategory]);

    // Cập nhật breadcrumb
    useEffect(() => {
        setBreadcrumb({
            category: selectedCategory?.name || null,
            topic: selectedSection?.title || null,
            article: selectedArticle?.title || null,
        });
    }, [selectedCategory, selectedSection, selectedArticle, setBreadcrumb]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [selectedCategory, selectedSection, selectedArticle]);

    // Handler để track progress khi user click vào article
    const handleArticleClick = async (article) => {
        // Always allow tracking regardless of hasAccess
        if (!selectedSection) {
            return;
        }

        const moduleSectionId = selectedSection.id;
        const sectionArticleId = article.id;

        try {
            // Check if this is the first time reading based on processStatus
            // processStatus === "NotStarted" means first time reading
            const processStatus = selectedSection.processStatus;
            const isFirstTime = processStatus === "NotStarted";

            // Track progress - mỗi lần click đều gọi API (data đã được cache rồi)
            await trackArticleProgress(
                moduleSectionId,
                sectionArticleId,
                isFirstTime
            );

            console.log(`📖 Article progress tracked: ${isFirstTime ? 'First time (POST)' : 'Already read (PUT)'}`, {
                moduleSectionId,
                sectionArticleId,
                articleTitle: article.title,
                processStatus: processStatus
            });
        } catch (error) {
            console.error("Error tracking article progress:", error);
            // Không cần làm gì thêm, data đã được cache
        }

        // Check hasAccess from article data - only lock if hasAccess === false
        const articleHasAccess = article?.hasAccess !== false;

        console.log('📖 KnowledgeModulePage - Clicking article:', {
            articleId: article.id,
            articleTitle: article.title,
            hasAccess: article.hasAccess,
            articleHasAccess: articleHasAccess,
            willLock: !articleHasAccess,
            note: 'Only lock if hasAccess === false from article data'
        });

        // Only set selected article if user has access
        if (articleHasAccess) {
            console.log('✅ KnowledgeModulePage - Article unlocked, proceeding');
            setSelectedArticle(article);
        } else {
            console.log('🚫 KnowledgeModulePage - Locking article, showing upgrade modal');
            setShowUpgradeModal(true);
        }
    };

    // Refresh section detail để cập nhật articles với completed status mới nhất
    const refreshSectionDetail = async () => {
        if (!selectedSection) return;

        try {
            // Xóa cache để lấy data mới nhất
            const cacheKey = `wellness_section_${selectedSection.id}`;
            localStorage.removeItem(cacheKey);

            // Fetch lại section detail từ API
            const detail = await getSectionDetail(selectedSection.id, "vi");

            if (detail) {
                // Cache lại
                cacheSection(selectedSection.id, detail);

                // Tìm section từ sections list để lấy processStatus
                const sectionInfo = sections.find(s => s.id === selectedSection.id);

                // Cập nhật selectedSection với data mới (bao gồm articles với completed status)
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
                    articles: detail.articles || [],
                    processStatus: sectionInfo?.processStatus || detail.processStatus || "NotStarted"
                });
            }
        } catch (error) {
            console.error("Error refreshing section detail:", error);
        }
    };

    // Refresh sections list để cập nhật processStatus mới nhất
    const refreshSectionsList = async () => {
        if (!selectedCategory) return;

        try {
            const res = await getModuleSections(selectedCategory.id, 1, 10, "vi");
            const sectionData = res.data || [];

            const mappedSections = sectionData.map((s) => {
                let percent = 0;
                if (s.processStatus === "Completed") {
                    percent = 100;
                } else if (s.totalDuration > 0) {
                    // Tính percent dựa trên completedDuration và totalDuration
                    percent = Math.round((s.completedDuration || 0) / s.totalDuration * 100);
                    // Đảm bảo percent không vượt quá 100
                    percent = Math.min(percent, 100);
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
                    processStatus: s.processStatus,
                };
            });

            setSections(mappedSections);

            // Cập nhật processStatus trong selectedSection nếu đang được chọn
            if (selectedSection) {
                const updatedSection = mappedSections.find(s => s.id === selectedSection.id);
                if (updatedSection) {
                    setSelectedSection(prev => ({
                        ...prev,
                        processStatus: updatedSection.processStatus,
                        completedDuration: updatedSection.completedDuration || 0,
                    }));
                }
            }
        } catch (error) {
            console.error("Error refreshing sections list:", error);
        }
    };

    const handleNavigate = (level) => {
        if (level === "home" || level === "root") {
            setSelectedCategory(null);
            setSelectedSection(null);
            setSelectedArticle(null);
            // Clear URL params khi về home
            navigate("/space/knowledge");
        } else if (level === "category") {
            setSelectedSection(null);
            setSelectedArticle(null);
            // Update URL: xóa sectionId, chỉ giữ categoryId nếu có
            if (selectedCategory) {
                navigate(`/space/knowledge?categoryId=${selectedCategory.id}`);
            } else {
                navigate("/space/knowledge");
            }
        } else if (level === "topic") {
            setSelectedArticle(null);
            // Update URL: xóa article selection, chỉ giữ sectionId
            if (selectedSection) {
                navigate(`/space/knowledge?sectionId=${selectedSection.id}`);
            } else if (selectedCategory) {
                navigate(`/space/knowledge?categoryId=${selectedCategory.id}`);
            }
            // Khi quay lại từ article, refresh section detail và sections list
            refreshSectionDetail();
            refreshSectionsList();
        }
    };


    // Load cached section khi component mount nếu có
    useEffect(() => {
        // Có thể thêm logic để restore từ cache nếu cần
    }, []);

    const scrollToCategories = (e) => {
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }
        const el = document.querySelector(".category-section");
        if (!el) return;

        const headerOffset = 80; // offset for fixed navbar
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    // Track progress khi user scroll đến cuối bài viết
    const hasTrackedCompletionRef = useRef(false);

    useEffect(() => {
        if (!selectedArticle || !selectedSection) {
            hasTrackedCompletionRef.current = false;
            return;
        }

        // Reset flag khi chuyển sang article mới
        hasTrackedCompletionRef.current = false;

        const handleScroll = () => {
            if (hasTrackedCompletionRef.current) return; // Đã track rồi thì không track nữa

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

            // Nếu user scroll đến 80% bài viết, track progress với processStatus Completed
            if (scrollPercentage >= 0.8) {
                hasTrackedCompletionRef.current = true;
                const moduleSectionId = selectedSection.id;
                const sectionArticleId = selectedArticle.id;

                // Track progress với processStatus Completed
                updateModuleProgress(moduleSectionId, sectionArticleId, null, "Completed")
                    .then(() => {
                        console.log('✅ Article marked as completed');
                        // Refresh section detail để cập nhật completed status
                        refreshSectionDetail();
                    })
                    .catch((error) => {
                        console.error("Error marking article as completed:", error);
                        hasTrackedCompletionRef.current = false; // Reset nếu có lỗi
                    });
            }
        };

        // Throttle scroll event
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [selectedArticle?.id, selectedSection?.id]);

    const renderArticleDetail = () => {
        if (!selectedArticle) return null;

        // Lấy danh sách articles từ selectedSection để có thể navigate
        const articles = selectedSection?.articles || [];
        const currentIndex = articles.findIndex(a => a.id === selectedArticle.id);
        const hasPrev = currentIndex > 0;
        const hasNext = currentIndex < articles.length - 1;

        const handlePrevArticle = async () => {
            if (hasPrev) {
                // Refresh section detail trước khi chuyển sang article khác
                await refreshSectionDetail();
                handleArticleClick(articles[currentIndex - 1]);
            }
        };

        const handleNextArticle = async () => {
            if (hasNext) {
                // Refresh section detail trước khi chuyển sang article khác
                await refreshSectionDetail();
                handleArticleClick(articles[currentIndex + 1]);
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
                {/* Navigation header */}
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


                {/* Render nội dung JSON blocks */}
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
                                1: "text-[#8131ad]",        // brand purple for H1
                                2: "text-[#9c72d9]",        // muted lavender for H2
                                3: "text-slate-800",        // balanced dark for H3
                                4: "text-slate-600"         // subtle for H4
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

                {/* Navigation buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={async () => {
                            setSelectedArticle(null);
                            // Refresh section detail để cập nhật articles với completed status
                            await refreshSectionDetail();
                            // Refresh sections list để cập nhật processStatus
                            await refreshSectionsList();
                        }}
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

    // Render danh sách articles trong section
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
                    {isMobile ? (
                        // Mobile: Vertical list với icon bên trái, text bên phải
                        <div className="w-full mt-6 space-y-4">
                            {articles.map((article, index) => {
                                // Parse description từ content
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

                                const articleHasAccess = article?.hasAccess !== false;
                                const imageSrc = article.mediaUrl || selectedSection.mediaUrl;
                                const isExpanded = expandedArticles.has(article.id);
                                const shouldShowExpand = description.length > 100; // Nếu description dài hơn 100 ký tự thì hiện nút expand

                                const handleCardClick = () => {
                                    // Nếu không có access, hiển thị modal upgrade
                                    if (!articleHasAccess) {
                                        setShowUpgradeModal(true);
                                        return;
                                    }
                                    // Click vào card sẽ tự động expand nếu chưa expand
                                    if (!isExpanded && shouldShowExpand) {
                                        setExpandedArticles(prev => {
                                            const newSet = new Set(prev);
                                            newSet.add(article.id);
                                            return newSet;
                                        });
                                    }
                                };

                                const handleCollapse = (e) => {
                                    e.stopPropagation();
                                    setExpandedArticles(prev => {
                                        const newSet = new Set(prev);
                                        newSet.delete(article.id);
                                        return newSet;
                                    });
                                };

                                const handleViewClick = (e) => {
                                    e.stopPropagation();
                                    handleArticleClick(article);
                                };

                                return (
                                    <div
                                        key={article.id}
                                        onClick={handleCardClick}
                                        className={`bg-white rounded-lg shadow-md p-4 transition-all w-full cursor-pointer ${articleHasAccess ? 'hover:shadow-lg' : 'opacity-50'} ${isExpanded ? 'flex flex-col gap-4' : 'flex items-start gap-4'}`}
                                    >
                                        {/* Icon/Image */}
                                        <div className={isExpanded ? "w-full" : "flex-shrink-0"}>
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={article.title}
                                                    className={`object-cover rounded-lg ${isExpanded ? 'w-full h-48' : 'w-20 h-20'}`}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className={`bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center ${isExpanded ? 'w-full h-48' : 'w-20 h-20'}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={isExpanded ? "w-16 h-16 text-white" : "w-10 h-10 text-white"}>
                                                        <path d="M5 4h14v2H5zM5 8h14v2H5zM5 12h10v2H5zM5 16h10v2H5z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {/* Text */}
                                        <div className={isExpanded ? "w-full" : "flex-1 min-w-0"}>
                                            <h3 className="text-base font-semibold text-purple-800 mb-1 line-clamp-2 break-words">
                                                {article.title}
                                            </h3>
                                            <p className={`text-sm text-gray-600 mb-2 break-words ${!isExpanded && shouldShowExpand ? 'line-clamp-2' : ''}`}>
                                                {description}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mb-2">
                                                {article.orderIndex && (
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded flex-shrink-0">
                                                        Bài {article.orderIndex}
                                                    </span>
                                                )}
                                                {article.completed && (
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex-shrink-0 flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                        </svg>
                                                        Hoàn thành
                                                    </span>
                                                )}
                                                {!article.completed && article.duration && (
                                                    <span>{article.duration} phút</span>
                                                )}
                                            </div>
                                            {/* Nút Xem thêm khi chưa expand */}
                                            {shouldShowExpand && !isExpanded && articleHasAccess && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCardClick();
                                                    }}
                                                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium mt-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                        <path d="M6 9l6 6 6-6" />
                                                    </svg>
                                                    Xem thêm
                                                </button>
                                            )}
                                            {/* Nút khi expanded */}
                                            {isExpanded && (
                                                <div className="flex flex-col items-center gap-2 mt-2">
                                                    <button
                                                        onClick={handleCollapse}
                                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 font-medium"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                            <path d="M18 15l-6-6-6 6" />
                                                        </svg>
                                                        Thu gọn
                                                    </button>
                                                    <button
                                                        onClick={handleViewClick}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                                    >
                                                        Xem
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Desktop: Grid layout như cũ
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                            {articles.map((article, index) => {
                                // Parse description từ content
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
                                    // Nếu lỗi parse, dùng title làm description
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
                                        onClick={() => handleArticleClick(article)}
                                        isModule={false}
                                    />
                                );
                            })}
                        </div>
                    )}
                </section>
                <Button onClick={() => setSelectedSection(null)} className="mt-6">
                    Quay lại danh sách bài học
                </Button>
            </motion.div>
        );
    };

    const handleSectionClick = async (section) => {
        // Don't check hasAccess here - sections list API doesn't return hasAccess
        // Only check hasAccess after fetching section detail
        console.log('📚 KnowledgeModulePage - Clicking section from list:', {
            sectionId: section.id,
            sectionName: section.name,
            hasAccess: section.hasAccess,
            note: 'Sections list API does not return hasAccess - will check after fetching detail'
        });

        try {
            setLoadingSectionDetail(true);

            // Kiểm tra cache trước
            let detail = getCachedSection(section.id);

            if (!detail) {
                // Nếu không có cache, fetch từ API
                detail = await getSectionDetail(section.id, "vi");

                // Cache lại sau khi fetch
                if (detail) {
                    cacheSection(section.id, detail);
                }
            }

            if (detail) {
                // Check hasAccess from section detail (this API returns hasAccess)
                // Only lock if hasAccess is explicitly false
                const sectionHasAccess = detail.hasAccess !== false;

                console.log('🔒 KnowledgeModulePage - Section detail fetched:', {
                    sectionId: detail.id,
                    sectionTitle: detail.title,
                    hasAccess: detail.hasAccess,
                    sectionHasAccess: sectionHasAccess,
                    willLock: !sectionHasAccess,
                    note: 'Only lock if hasAccess === false from section detail API'
                });

                if (!sectionHasAccess) {
                    console.log('🚫 KnowledgeModulePage - Locking section, showing upgrade modal');
                    setShowUpgradeModal(true);
                    setLoadingSectionDetail(false);
                    return;
                }

                console.log('✅ KnowledgeModulePage - Section unlocked, proceeding');

                // Tìm section từ sections list để lấy processStatus
                const sectionInfo = sections.find(s => s.id === section.id);
                // Set selectedSection với full detail (có articles)
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
                    articles: detail.articles || [],
                    processStatus: sectionInfo?.processStatus || detail.processStatus || "NotStarted" // Lưu processStatus từ section list
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
    };

    const renderSectionList = () => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pb-8 md:pb-12"
        >
            <HeroSection
                title={selectedCategory.name}
                description={selectedCategory.description}
                img={selectedCategory.imageURL}
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
                    <p className="text-center text-white">Đang tải bài học...</p>
                ) : sections.length > 0 ? (
                    <>
                        {isMobile ? (
                            // Mobile: Vertical list với icon bên trái, text bên phải
                            <div className="w-full mt-6 space-y-4 ">
                                {sections.map((section) => {
                                    // Tính percent: luôn tính lại dựa trên completedDuration và totalDuration để đảm bảo chính xác
                                    let percent = 0;
                                    if (section.processStatus === "Completed") {
                                        percent = 100;
                                    } else if (section.totalDuration > 0) {
                                        percent = Math.round((section.completedDuration || 0) / section.totalDuration * 100);
                                        // Đảm bảo percent không vượt quá 100
                                        percent = Math.min(percent, 100);
                                    }
                                    const imageSrc = section.imageURL;
                                    const isExpanded = expandedSections.has(section.id);
                                    const description = section.description || '';
                                    const shouldShowExpand = description.length > 100; // Nếu description dài hơn 100 ký tự thì hiện nút expand

                                    const handleCardClick = () => {
                                        // Click vào card sẽ tự động expand nếu chưa expand
                                        if (!isExpanded && shouldShowExpand) {
                                            setExpandedSections(prev => {
                                                const newSet = new Set(prev);
                                                newSet.add(section.id);
                                                return newSet;
                                            });
                                        }
                                    };

                                    const handleCollapse = (e) => {
                                        e.stopPropagation();
                                        setExpandedSections(prev => {
                                            const newSet = new Set(prev);
                                            newSet.delete(section.id);
                                            return newSet;
                                        });
                                    };

                                    const handleViewClick = (e) => {
                                        e.stopPropagation();
                                        handleSectionClick(section);
                                    };

                                    return (
                                        <div
                                            key={section.id}
                                            onClick={handleCardClick}
                                            className={`bg-white rounded-lg shadow-md p-3 transition-all hover:shadow-lg w-full cursor-pointer ${isExpanded ? 'flex flex-col gap-4' : 'flex items-start gap-4'}`}
                                        >
                                            {/* Icon/Image */}
                                            <div className={isExpanded ? "w-full" : "flex-shrink-0"}>
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={section.name}
                                                        className={`object-cover rounded-lg ${isExpanded ? 'w-full h-48' : 'w-20 h-20'}`}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className={`bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center ${isExpanded ? 'w-full h-48' : 'w-20 h-20'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={isExpanded ? "w-16 h-16 text-white" : "w-10 h-10 text-white"}>
                                                            <path d="M4 6h16v2H4zM4 10h16v2H4zM4 14h10v2H4z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Text */}
                                            <div className={isExpanded ? "w-full" : "flex-1 min-w-0"}>
                                                <h3 className="text-xl font-semibold text-purple-800 mb-1 line-clamp-2 break-words">
                                                    {section.name}
                                                </h3>
                                                <p className={`text-sm text-gray-600 mb-2 break-words ${!isExpanded && shouldShowExpand ? 'line-clamp-2' : ''}`}>
                                                    {description}
                                                </p>
                                                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mb-2">
                                                    {section.totalDuration && (
                                                        <span>{section.totalDuration} phút</span>
                                                    )}
                                                    {section.articleCount && (
                                                        <span>{section.articleCount} bài viết</span>
                                                    )}
                                                    <span className={`px-2 py-1 rounded flex-shrink-0 ${percent === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {percent === 100 ? 'Hoàn thành' : `${percent || 0}%`}
                                                    </span>
                                                </div>
                                                {/* Nút Xem thêm khi chưa expand */}
                                                {shouldShowExpand && !isExpanded && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCardClick();
                                                        }}
                                                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium mt-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                            <path d="M6 9l6 6 6-6" />
                                                        </svg>
                                                        Xem thêm
                                                    </button>
                                                )}
                                                {/* Nút khi expanded */}
                                                {isExpanded && (
                                                    <div className="flex flex-col items-center gap-2 mt-2">
                                                        <button
                                                            onClick={handleCollapse}
                                                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 font-medium"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                                <path d="M18 15l-6-6-6 6" />
                                                            </svg>
                                                            Thu gọn
                                                        </button>
                                                        <button
                                                            onClick={handleViewClick}
                                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                                        >
                                                            Xem
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // Desktop: Grid layout như cũ
                            <ArticleList
                                modules={sections.map((s) => ({
                                    id: s.id,
                                    name: s.name,
                                    imageURL: s.imageURL,
                                    description: s.description,
                                    totalDuration: s.totalDuration,
                                    completedDuration: s.completedDuration,
                                }))}
                                onSelectModule={handleSectionClick}
                            />
                        )}
                    </>
                ) : (
                    <p className="text-center text-white">Chưa có bài học nào.</p>
                )}
            </section>
            <Button onClick={() => setSelectedCategory(null)} className="mt-6 mb-8 md:mb-12">
                Quay lại danh mục
            </Button>
        </motion.div>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Đang tải...</p></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600"><p>{error}</p></div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-2 px-6">
            <KnowledgeBreadcrumb
                category={selectedCategory?.name}
                topic={selectedSection?.title}
                article={selectedArticle?.title}
                onNavigate={handleNavigate}
            />

            {/* Trang chủ */}
            {!selectedCategory && !selectedSection && !selectedArticle && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                    <HeroSection
                        title="Bài viết về Sức khỏe Tâm lý"
                        description="Khám phá các chủ đề về sức khỏe tinh thần, quản lý cảm xúc, xây dựng thói quen lành mạnh."
                        img="/knowledge/emo1c.png"
                        button={{ label: "Xem Danh mục", onClick: scrollToCategories }}
                        compact
                    />
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-orange-200 flex items-center justify-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4.5L5 20l2.5-7L2 9h7z" />
                                </svg>
                            </span>
                            Danh mục Chủ đề
                        </h2>
                    </div>
                    <section className="category-section w-full">
                        <CategoryList categories={categories} onSelectCategory={setSelectedCategory} />
                    </section>
                </motion.div>
            )}

            {/* Danh sách section */}
            {selectedCategory && !selectedSection && !selectedArticle && renderSectionList()}

            {/* Danh sách articles trong section */}
            {selectedSection && !selectedArticle && renderSectionArticles()}

            {/* Loading section detail */}
            {loadingSectionDetail && (
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-white">Đang tải chi tiết bài học...</p>
                </div>
            )}

            {/* Chi tiết bài viết */}
            {selectedArticle && !loadingSectionDetail && renderArticleDetail()}

            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default ArticlesPage;