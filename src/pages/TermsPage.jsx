import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
// framer-motion removed for performance on this page
import TermLayout from "@/components/organisms/Terms/TermLayout";
import Privacy from "@/components/organisms/Terms/Privacy";
import TermsOfUse from "@/components/organisms/Terms/TermsOfUse";
import TabNavigation from "@/components/molecules/TabNavigation";
import HeroSection from "@/components/molecules/HeroSection";
// removed animation hook usage

export default function TermsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "privacy"
  );
  // no animation variants

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = [
    { id: "privacy", label: "Quyền riêng tư", icon: "" },
    { id: "terms", label: "Điều khoản", icon: "" },
  ];

  const heroContent = {
    title: "Chính sách",
    subtitle:
      "Khám phá các điều khoản và chính sách bảo mật của chúng tôi để hiểu rõ hơn về cách chúng tôi bảo vệ thông tin của bạn",
  };

  return (
    <TermLayout>
      {/* Hero Section */}
      {/* <HeroSection {...heroContent} /> */}

      {/* Navigation Tabs */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Content Area */}
      <div className="relative z-20 pb-10 md:py-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          {activeTab === "privacy" ? <Privacy /> : <TermsOfUse />}
        </div>
      </div>
    </TermLayout>
  );
}
