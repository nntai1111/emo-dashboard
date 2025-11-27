import React, { useEffect, useState, useMemo, useRef } from "react";
import { tokenManager } from "../../services/tokenManager";
import OnscreenStats from "./OnscreenStats";

// Component props: optional `year` and `month` (integers). If not provided, current year/month are used.
const BehaviorMock = ({ year: propYear, month: propMonth }) => {
    const [points, setPoints] = useState([]); // array of { date, newUserCount }
    const [totalUsers, setTotalUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const now = new Date();
    const initialYear = propYear || now.getFullYear();
    const initialMonth = propMonth || now.getMonth() + 1; // JS months: 0-11, API expects 1-12

    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = await tokenManager.ensureValidToken();
                if (!token) throw new Error("No auth token available");

                // Daily new users
                const qs = `?year=${encodeURIComponent(selectedYear)}&month=${encodeURIComponent(selectedMonth)}`;
                const dailyResp = await fetch(`https://api.emoease.vn/profile-service/api/v1/dashboard/daily-new-users${qs}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!dailyResp.ok) {
                    const txt = await dailyResp.text();
                    throw new Error(`daily-new-users API error: ${dailyResp.status} ${txt}`);
                }

                const dailyData = await dailyResp.json();
                const pointsData = (dailyData?.dailyNewUserStats?.points || []).map((p) => ({
                    date: p.date,
                    newUserCount: Number(p.newUserCount) || 0,
                }));

                // Total users count
                const totalResp = await fetch(`https://api.emoease.vn/profile-service/api/v1/dashboard/total-users-count`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!totalResp.ok) {
                    const txt = await totalResp.text();
                    throw new Error(`total-users-count API error: ${totalResp.status} ${txt}`);
                }

                const totalData = await totalResp.json();

                if (mounted) {
                    setPoints(pointsData);
                    setTotalUsers(typeof totalData.totalUsersCount === "number" ? totalData.totalUsersCount : Number(totalData.totalUsersCount) || null);
                }
            } catch (err) {
                console.error(err);
                if (mounted) setError(err.message || String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [selectedYear, selectedMonth]);

    // Prepare chart data (labels = day numbers, values = counts)
    const chartData = useMemo(() => {
        if (!points || points.length === 0) return { labels: [], values: [] };

        const labels = points.map((p) => {
            try {
                const d = new Date(p.date);
                return `${d.getDate()}`;
            } catch (e) {
                return p.date;
            }
        });

        const values = points.map((p) => p.newUserCount || 0);
        return { labels, values };
    }, [points]);

    // Simple SVG line chart renderer with tooltip on hover
    const LineChart = ({ labels, values, pointsRaw = [] }) => {
        if (!labels.length) return <div className="text-sm text-slate-500">Không có dữ liệu</div>;

        const width = 700;
        const height = 220;
        const left = 54; // reserve space for y-axis labels
        const right = 20;
        const top = 20;
        const bottom = 44; // space for x labels
        const chartWidth = width - left - right;
        const chartHeight = height - top - bottom;

        const maxValue = Math.max(...values, 1);
        const minValue = Math.min(...values, 0);
        const range = maxValue - minValue || 1;

        const pointsSvg = values.map((v, i) => {
            const x = left + (i / (values.length - 1 || 1)) * chartWidth;
            const y = top + chartHeight - ((v - minValue) / range) * chartHeight;
            return { x, y, v };
        });

        const pathData = pointsSvg.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

        // Y axis ticks
        const ticksCount = 4;
        const tickValues = Array.from({ length: ticksCount + 1 }, (_, i) => {
            const v = minValue + (i / ticksCount) * range;
            return Math.round(v);
        });

        const containerRef = useRef(null);
        const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null, date: null });

        const showTooltip = (ev, idx) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const clientX = ev.clientX || ev.nativeEvent?.clientX || 0;
            const clientY = ev.clientY || ev.nativeEvent?.clientY || 0;
            const x = rect ? clientX - rect.left + 8 : clientX + 8;
            const y = rect ? clientY - rect.top - 28 : clientY - 28;
            const val = values[idx];
            const date = pointsRaw[idx]?.date || labels[idx];
            setTooltip({ visible: true, x, y, value: val, date });
        };

        const moveTooltip = (ev) => {
            if (!tooltip.visible) return;
            const rect = containerRef.current?.getBoundingClientRect();
            const clientX = ev.clientX || ev.nativeEvent?.clientX || 0;
            const clientY = ev.clientY || ev.nativeEvent?.clientY || 0;
            const x = rect ? clientX - rect.left + 8 : clientX + 8;
            const y = rect ? clientY - rect.top - 28 : clientY - 28;
            setTooltip((t) => ({ ...t, x, y }));
        };

        const hideTooltip = () => setTooltip({ visible: false, x: 0, y: 0, value: null, date: null });

        return (
            <div ref={containerRef} className="w-full overflow-x-auto relative" onMouseMove={moveTooltip} onMouseLeave={hideTooltip}>
                <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    {tickValues.map((tv, idx) => {
                        const y = top + (1 - (tv - minValue) / range) * chartHeight;
                        return (
                            <g key={idx}>
                                <line x1={left} y1={y} x2={left + chartWidth} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                                <text x={left - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="11">{tv.toLocaleString()}</text>
                            </g>
                        );
                    })}

                    {labels.map((lbl, i) => {
                        const x = left + (i / (labels.length - 1 || 1)) * chartWidth;
                        return (
                            <text key={i} x={x} y={height - bottom + 28} textAnchor="middle" fill="#64748b" fontSize="11" className="font-medium">
                                {lbl}
                            </text>
                        );
                    })}

                    <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                    <path d={`${pathData} L ${pointsSvg[pointsSvg.length - 1].x} ${top + chartHeight} L ${pointsSvg[0].x} ${top + chartHeight} Z`} fill="#3b82f6" opacity="0.12" />

                    <defs>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {pointsSvg.map((p, i) => (
                        <g key={i}>
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#3b82f6"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={(e) => showTooltip(e, i)}
                                onMouseMove={(e) => showTooltip(e, i)}
                                onMouseLeave={hideTooltip}
                            />
                        </g>
                    ))}
                </svg>

                {tooltip.visible && (
                    <div style={{ left: tooltip.x, top: tooltip.y }} className="absolute z-50 pointer-events-none bg-white border px-2 py-1 rounded shadow text-xs">
                        <div className="font-semibold">{tooltip.value?.toLocaleString?.() ?? tooltip.value} người</div>
                        <div className="text-[11px] text-slate-500">{tooltip.date}</div>
                    </div>
                )}
            </div>
        );
    };

    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const currentYear = now.getFullYear();
    const years = Array.from({ length: 6 }).map((_, i) => currentYear - i); // current year and previous 5 years

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">

            {/* Onscreen Stats Section */}
            <OnscreenStats />
        </div>
    );
};

export default BehaviorMock;

