import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import FeedNav from "../components/molecules/FeedNav";
import CategoryFilterBreadcrumb from "../components/molecules/CategoryFilterBreadcrumb";
import tagCategoryData from "../data/tagCategory.json";
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTab, setSelectedTab] = useState("feed");

  // Memoize API mapping to avoid recreating on every render
  const API_ID_MAPPING = useMemo(() => ({
    "772eec7e-55f7-4729-b6d1-c99d9d21fe2b": 0,
    "f2ad307c-d771-4c09-98f3-13691c51d6da": 1,
    "8bc81ddd-66e6-4dfc-bfc4-7fd87ca10b5c": 2,
    "7f6569b0-b1fe-4c0b-b8bc-fed8aabb10d4": 3,
    "3ab22d69-183d-4f21-b866-c81b7433f6d1": 4,
    "69a318c3-6a0c-41a2-941b-56b8e4d65e31": 5,
    "de70373a-5070-4556-afa5-611689b52d8a": 6,
    "0cc7adc5-b40b-433c-8513-642b5289eff0": 7,
    "e7b0476a-714a-4d41-892c-e83d8f819263": 8,
    "7bfc4693-ec77-4e05-9d21-79d7ae000e69": 9,
    "294bff61-5f42-48de-b514-96988e25fe84": 10,
    "dbe2fe15-bc5e-4a7d-ac87-23692aa1fc80": 11,
    "79e84978-886f-47ef-a724-ee5d990cb4dd": 12,
    "b7b48afe-4300-43a4-8748-530a8b493565": 13,
    "e8dcb402-e04f-4a84-882f-883b6c05bdc1": 14,
    "357a2878-c0a6-4f65-be7d-8bc23cf391af": 15,
    "a12a2d6d-5984-4858-a055-aec62c6e3550": 16,
    "e88d107a-86b1-495c-869c-d1e2d1c28831": 17,
  }), []);

  // Memoize categories to avoid recreating on every render
  const allCategories = useMemo(() =>
    Array.isArray(tagCategoryData?.categoryTags) ? tagCategoryData.categoryTags : [],
    []
  );

  // Memoize category selection handler to avoid recreating on every render
  const handleSelectCategory = useCallback((e) => {
    try {
      const { categoryId } = e.detail || {};
      if (!categoryId) return;

      let found = allCategories.find((c) => c.id === categoryId);

      if (!found) {
        const mappedIndex = API_ID_MAPPING[categoryId];
        if (mappedIndex !== undefined && allCategories[mappedIndex]) {
          found = allCategories[mappedIndex];
        }
      }

      setSelectedCategory(found || null);
      setSelectedTab("feed");
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch { }
    } catch { }
  }, [allCategories, API_ID_MAPPING]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("app:selectCategory", handleSelectCategory);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("app:selectCategory", handleSelectCategory);
    };
  }, [handleSelectCategory]);

  // Memoize category comparison function to avoid recreating on every render
  const isSameCategory = useCallback((cat1, cat2) => {
    if (!cat1 || !cat2) return false;
    if (cat1.id === cat2.id) return true;

    const cat1Index = allCategories.findIndex((c) => c.id === cat1.id);
    const cat2Index = allCategories.findIndex((c) => c.id === cat2.id);

    if (cat1Index !== -1 && cat2Index !== -1 && cat1Index === cat2Index)
      return true;

    const cat1MappedIndex = API_ID_MAPPING[cat1.id];
    const cat2MappedIndex = API_ID_MAPPING[cat2.id];

    if (
      cat1MappedIndex !== undefined &&
      cat2MappedIndex !== undefined &&
      cat1MappedIndex === cat2MappedIndex
    )
      return true;

    if (
      cat1MappedIndex !== undefined &&
      cat2Index !== -1 &&
      cat1MappedIndex === cat2Index
    )
      return true;
    if (
      cat2MappedIndex !== undefined &&
      cat1Index !== -1 &&
      cat2MappedIndex === cat1Index
    )
      return true;

    return false;
  }, [allCategories, API_ID_MAPPING]);

  const toggleFilter = useCallback((category) => {
    if (selectedCategory && isSameCategory(selectedCategory, category)) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  }, [selectedCategory, isSameCategory]);

  const clearCategoryFilter = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const backToHome = useCallback(() => {
    setSelectedCategory(null);
    setSelectedTab("feed");
  }, []);

  return (
    <div className="flex h-screen flex-col">
      {/* Nội dung chính - Căn giữa toàn bộ */}
      <div className="flex-1 flex flex-col items-center px-2 sm:px-4 overflow-y-auto scrollbar-none">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 backdrop-blur-md pb-2 pt-2 mb-2 shadow-sm w-full max-w-2xl">
          {isMobile ? (
            <div className="flex flex-col gap-3">
              <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
            </div>
          )}
        </div>

        {/* Nội dung cuộn - Căn giữa */}
        <div className="w-full max-w-2xl space-y-4 pb-8">
          {/* Category Filter Breadcrumb */}
          <CategoryFilterBreadcrumb
            selectedCategory={selectedCategory}
            onClearFilter={clearCategoryFilter}
            onBackToHome={backToHome}
          />

          {/* CreatePost */}
          {selectedTab !== "mine" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-2 border-purple-200 rounded-2xl"
            >
              <CreatePost />
            </motion.div>
          )}

          {/* Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Feed
              onNavigateToChat={handleNavigateToChat}
              selectedCategory={selectedCategory}
              selectedTab={selectedTab}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;