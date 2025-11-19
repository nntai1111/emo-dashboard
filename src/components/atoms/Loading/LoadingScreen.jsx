import React from "react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0e1b1f]">
      {/* halo */}
      <div className="absolute w-[240px] h-[240px] rounded-full blur-xl opacity-30 bg-[radial-gradient(circle,rgba(129,140,248,0.35),transparent_60%)]" />
      <div className="relative flex items-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-white/30 border-t-transparent animate-spin" />
        <div className="text-white/90 text-sm">Đang tải dữ liệu...</div>
      </div>
    </div>
  );
}
