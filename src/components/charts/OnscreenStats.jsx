import React, { useEffect, useState } from "react";
import { tokenManager } from "../../services/tokenManager";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ComposedChart
} from "recharts";
import RetentionChart from "./RetentionChart";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

const formatSeconds = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return "0 giây";
    const secs = Math.round(totalSeconds);
    if (secs < 60) return `${secs} giây`;

    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;

    if (minutes < 60) {
        return seconds > 0 ? `${minutes} phút ${seconds} giây` : `${minutes} phút`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) return `${hours} giờ`;
    if (seconds === 0) return `${hours} giờ ${mins} phút`;
    return `${hours} giờ ${mins} phút ${seconds} giây`;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
                <p className="font-medium text-gray-800">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} style={{ color: entry.color }}>
                        {entry.name === "Giây trung bình"
                            ? `${entry.name}: ${formatSeconds(entry.value)}`
                            : `${entry.name}: ${entry.value.toLocaleString()} ${entry.name.includes("Users") ? "người" : ""}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const OnscreenStats = () => {
    const [onscreenData, setOnscreenData] = useState([]);
    const [totals, setTotals] = useState({});
    const [regData, setRegData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regLoading, setRegLoading] = useState(true);
    const [retentionData, setRetentionData] = useState([]);
    const [retentionLoading, setRetentionLoading] = useState(true);
    const [retentionError, setRetentionError] = useState(null);

    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

    const fetchOnscreen = async () => {
        setLoading(true);
        try {
            const token = await tokenManager.ensureValidToken();
            const resp = await fetch(`https://api.emoease.vn/chatbox-service/api/AIChat/dashboard/onscreen-stats?maxWeeks=12`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!resp.ok) throw new Error("Lỗi tải dữ liệu onscreen");
            const data = await resp.json();

            const sorted = (data.points || [])
                .map(p => {
                    const d = new Date(p.activityDate);
                    return {
                        date: format(d, "dd/MM"),
                        dayName: format(d, "EEE"),
                        activeUsers: Number(p.totalActiveUsers) || 0,
                        avgSeconds: Number(p.avgOnscreenSecondsPerUser) || 0,
                        ts: d.getTime(),
                        month: d.getMonth() + 1,
                        year: d.getFullYear(),
                    };
                })
                .sort((a, b) => a.ts - b.ts);

            setOnscreenData(sorted);
            setTotals({
                totalActiveAllTime: data.totalActiveUsersAllTime || 0,
                totalSecondsAllTime: Number(data.totalSystemOnscreenSecondsAllTime) || 0,
                avgSecondsAllTime: Number(data.avgOnscreenSecondsPerUserAllTime) || 0,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistration = async () => {
        setRegLoading(true);
        try {
            const token = await tokenManager.ensureValidToken();

            const dailyResp = await fetch(
                `https://api.emoease.vn/profile-service/api/v1/dashboard/daily-new-users?year=${selectedYear}&month=${selectedMonth}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const dailyData = await dailyResp.json();

            const totalResp = await fetch(
                `https://api.emoease.vn/profile-service/api/v1/dashboard/total-users-count`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const totalData = await totalResp.json();
            setTotalUsers(totalData.totalUsersCount || 0);

            const start = startOfMonth(new Date(selectedYear, selectedMonth - 1));
            const end = endOfMonth(start);
            const days = eachDayOfInterval({ start, end });

            const map = new Map(
                (dailyData?.dailyNewUserStats?.points || []).map(p => [
                    p.date,
                    Number(p.newUserCount) || 0
                ])
            );

            const chartData = days.map(day => ({
                date: format(day, "dd/MM"),
                day: format(day, "dd"),
                newUsers: map.get(format(day, "yyyy-MM-dd")) || 0,
            }));

            setRegData(chartData);
        } catch (err) {
            console.error(err);
        } finally {
            setRegLoading(false);
        }
    };

    useEffect(() => {
        fetchOnscreen();
    }, []);

    useEffect(() => {
        fetchRegistration();
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        const fetchRetention = async () => {
            setRetentionLoading(true);
            try {
                const token = await tokenManager.ensureValidToken();
                const resp = await fetch("https://api.emoease.vn/chatbox-service/api/AIChat/dashboard/retention-curve?weeks=4", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resp.ok) throw new Error("Lỗi tải dữ liệu retention curve");
                const data = await resp.json();
                setRetentionData(Array.isArray(data) ? data : []);
                setRetentionError(null);
            } catch (err) {
                console.error(err);
                setRetentionError(err.message || String(err));
            } finally {
                setRetentionLoading(false);
            }
        };
        fetchRetention();
    }, []);

    // Filter onscreen data by the selected month & year (same controls as registration)
    const filteredOnscreen = onscreenData.filter(d => d.month === selectedMonth && d.year === selectedYear);

    const last7Days = filteredOnscreen.slice(-7);
    const last30Days = filteredOnscreen.slice(-30);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Tổng quan nhanh */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
                        <p className="text-sm opacity-90">Tổng người dùng</p>
                        <p className="text-3xl font-bold mt-1">{regLoading ? "..." : totalUsers?.toLocaleString() || "-"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
                        <p className="text-sm opacity-90">Active Users (tất cả)</p>
                        <p className="text-3xl font-bold mt-1">{loading ? "..." : totals.totalActiveAllTime?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
                        <p className="text-sm opacity-90">Tổng thời gian sử dụng</p>
                        <p className="text-2xl font-bold mt-1 leading-tight">
                            {loading ? "..." : formatSeconds(totals.totalSecondsAllTime)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition">
                        <p className="text-sm opacity-90">Thời gian TB/người</p>
                        <p className="text-2xl font-bold mt-1 leading-tight">
                            {loading ? "..." : formatSeconds(totals.avgSecondsAllTime)}
                        </p>
                    </div>
                </div>

                {/* HÀNG 1: 3 CHART ĐẦU - ĐĂNG KÝ MỚI | ACTIVE + TGIAN | RETENTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* 1. Đăng ký mới */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Người dùng đăng ký mới</h3>
                            <div className="flex gap-2">
                                <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)} className="text-sm border rounded-lg px-3 py-1.5">
                                    {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                                </select>
                                <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)} className="text-sm border rounded-lg px-3 py-1.5">
                                    {[2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={regData}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v) => `${v} người`} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="newUsers" fill="#3b82f6" radius={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 2. Active Users + Thời gian trung bình */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">Active Users & Thời gian trung bình</h3>
                            <div className="flex gap-2 items-center">
                                <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)} className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white">
                                    {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                                </select>
                                <select value={selectedYear} onChange={e => setSelectedYear(+e.target.value)} className="text-sm border border-gray-300 rounded-md px-4 py-2 bg-white">
                                    {[2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={filteredOnscreen}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="activeUsers" name="Active Users" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="avgSeconds" name="Thời gian trung bình" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>


                </div>

                {/* HÀNG 2: 2 CHART CUỐI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 3. RETENTION CURVE - ĐÃ LÊN TOP 3 */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 ">
                        <h3 className="text-lg font-semibold text-gray-800 p-6">Retention Curve (4 tuần)</h3>
                        {retentionLoading ? (
                            <div className="text-sm text-slate-600 py-8">Đang tải dữ liệu...</div>
                        ) : retentionError ? (
                            <div className="text-sm text-red-600 py-8">Lỗi: {retentionError}</div>
                        ) : (
                            <RetentionChart data={retentionData} height={300} />
                        )}
                    </div>
                    {/* 4. Active Users 7 ngày gần nhất */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Users - 7 ngày gần nhất</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={last7Days}>
                                <CartesianGrid strokeDasharray="4 4" />
                                <XAxis dataKey="dayName" tick={{ fontSize: 14, fontWeight: "bold" }} />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="activeUsers" stroke="#10b981" fill="#d1fae5" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 5. Xu hướng 30 ngày */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Xu hướng Active Users - 30 ngày gần nhất</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={last30Days}>
                                <CartesianGrid strokeDasharray="4 4" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="activeUsers" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-10 text-center text-xs text-gray-500">
                    Cập nhật lúc: {format(new Date(), "dd/MM/yyyy HH:mm")}
                </div>
            </div>
        </div>
    );
};

export default OnscreenStats;