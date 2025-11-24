// src/components/charts/ChatbotCohortHeatmap.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const formatCohortLabel = (dateStr) => {
    const date = new Date(dateStr);
    const start = date;
    const end = new Date(date);
    end.setDate(end.getDate() + 6);

    const options = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
};

const getCohortColor = (value) => {
    if (value === null || value === undefined || value === 0) return "bg-gray-200";
    if (value >= 50) return "bg-blue-900";
    if (value >= 30) return "bg-blue-800";
    if (value >= 20) return "bg-blue-700";
    if (value >= 10) return "bg-blue-600";
    if (value >= 5) return "bg-blue-500";
    if (value >= 2) return "bg-blue-400";
    return "bg-blue-300";
};

const ChatbotCohortHeatmap = () => {
    const [cohortData, setCohortData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Default: 12 tuần trước (thứ Hai của tuần này - 84 ngày)
    const today = new Date();
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - today.getDay() + 1);
    const defaultStart = new Date(mondayThisWeek);
    defaultStart.setDate(defaultStart.getDate() - 84);

    const [startDate, setStartDate] = useState(defaultStart.toISOString().split("T")[0]);
    const [maxWeeks, setMaxWeeks] = useState(7);
    const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token");

                const res = await axios.get(
                    "https://api.emoease.vn/chatbox-service/api/AIChat/dashboard/cohorts",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { startDate, maxWeeks },
                    }
                );

                const series = res.data.series || [];

                let transformed = series.map((item) => {
                    const map = { cohortSize: item.cohortSize };
                    item.points.forEach((p) => {
                        // store both percent and absolute active count (if provided)
                        const percent = p.percent ?? 0;
                        const count = p.active ?? p.count ?? Math.round((item.cohortSize || 0) * (percent / 100));
                        map[`w${p.week}`] = { percent, count };
                    });
                    map.w0 = { percent: 100, count: item.cohortSize };
                    return {
                        cohortWeek: item.cohortWeek,
                        cohort: formatCohortLabel(item.cohortWeek),
                        ...map,
                    };
                });

                // Sắp xếp
                transformed.sort((a, b) => {
                    if (sortOrder === "newest") {
                        return b.cohortWeek.localeCompare(a.cohortWeek);
                    }
                    return a.cohortWeek.localeCompare(b.cohortWeek);
                });

                setCohortData(transformed);
            } catch (err) {
                console.error("Lỗi tải chatbot cohort:", err);
                alert("Không thể tải dữ liệu cohort chatbot");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, maxWeeks, sortOrder]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Tỷ lệ người dùng quay lại dùng Chatbot theo cohort tuần
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        % người dùng từng chat với AI trong tuần đó, quay lại chat tiếp trong các tuần sau
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Từ ngày */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Số tuần */}
                    <div className="flex items-center gap-2">
                        <select
                            value={maxWeeks}
                            onChange={(e) => setMaxWeeks(+e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {[4, 5, 6, 7, 8, 9, 10, 12].map((w) => (
                                <option key={w} value={w}>{w} tuần</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-2">
                    <div className="h-6 bg-slate-100 rounded w-64"></div>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-slate-50 rounded"></div>
                    ))}
                </div>
            )}

            {/* Table */}
            {!loading && cohortData.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="text-sm">
                            <tr className="text-left text-slate-600 font-medium border-b">
                                <th className="min-w-20 sticky left-0 bg-white z-10">
                                    <button
                                        onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                                        className="py-1 text-xs hover:text-slate-900"
                                    >
                                        Tuần {sortOrder === "newest" ? "↓" : "↑"}
                                    </button>
                                </th>

                                {Array.from({ length: maxWeeks }, (_, i) => (
                                    <th key={i} className="text-center text-xs">Tuần {i}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {cohortData.map((row, idx) => (
                                <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50 transition">
                                    <td className="py-4 font-medium min-w-30 sticky left-0 bg-white z-10">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-medium">{row.cohort}</span>
                                            <span className="text-xs text-slate-500 mt-1">
                                                {row.cohortSize.toLocaleString()} người dùng
                                            </span>
                                        </div>
                                    </td>

                                    {Array.from({ length: maxWeeks }, (_, weekIdx) => {
                                        const val = row[`w${weekIdx}`];
                                        // val may be {percent, count} or undefined
                                        const percent = val ? (val.percent ?? 0) : undefined;
                                        const count = val ? (val.count ?? Math.round((row.cohortSize || 0) * ((percent || 0) / 100))) : undefined;

                                        return (
                                            <td key={weekIdx} className="py-2 text-center">
                                                {val !== undefined ? (
                                                    <div
                                                        className={`inline-flex flex-col items-center justify-center w-20 h-10 rounded-lg text-white font-medium text-xs shadow-sm ${getCohortColor(
                                                            percent
                                                        )}`}
                                                    >
                                                        <div className="leading-none">
                                                            {percent === 0 ? "0%" : (percent).toFixed(1) + "%"}
                                                        </div>
                                                        <div className="text-[10px] opacity-90 mt-1">
                                                            ( {typeof count === "number" ? count.toLocaleString() : "-"} active)
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 text-base">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-right text-xs text-slate-500">
                        {maxWeeks} tuần • từ {new Date(startDate).toLocaleDateString("vi-VN")} • {cohortData.length} cohort
                    </div>
                </div>
            )}

            {!loading && cohortData.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-base">
                    Chưa có người dùng nào sử dụng Chatbot trong khoảng thời gian này
                </div>
            )}
        </div>
    );
};

export default ChatbotCohortHeatmap;