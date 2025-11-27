import React, { useEffect, useState, useRef } from "react";
import { tokenManager } from "../../services/tokenManager";

const OnscreenStats = () => {
    const [points, setPoints] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [maxWeeks, setMaxWeeks] = useState(7);

    // State for registration chart
    const [regPoints, setRegPoints] = useState([]);
    const [regTotalUsers, setRegTotalUsers] = useState(null);
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState(null);

    const now = new Date();
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

    const fetchOnscreen = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await tokenManager.ensureValidToken();
            if (!token) throw new Error("No auth token available");

            let qs = `?maxWeeks=${encodeURIComponent(maxWeeks)}`;
            if (startDate) qs += `&startDate=${encodeURIComponent(startDate)}`;

            const resp = await fetch(`https://api.emoease.vn/chatbox-service/api/AIChat/dashboard/onscreen-stats${qs}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`onscreen-stats API error: ${resp.status} ${txt}`);
            }

            const data = await resp.json();
            setPoints(data.points || []);
            setTotals({
                totalActiveUsersAllTime: data.totalActiveUsersAllTime,
                totalSystemOnscreenSecondsAllTime: data.totalSystemOnscreenSecondsAllTime,
                avgOnscreenSecondsPerUserAllTime: data.avgOnscreenSecondsPerUserAllTime,
            });
        } catch (err) {
            console.error(err);
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistration = async () => {
        setRegLoading(true);
        setRegError(null);
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
            setRegPoints(pointsData);
            setRegTotalUsers(typeof totalData.totalUsersCount === "number" ? totalData.totalUsersCount : Number(totalData.totalUsersCount) || null);
        } catch (err) {
            console.error(err);
            setRegError(err.message || String(err));
        } finally {
            setRegLoading(false);
        }
    };

    useEffect(() => {
        fetchOnscreen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchRegistration();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear, selectedMonth]);

    // LineChart component (reusable)
    const LineChart = ({ labels, values, pointsRaw = [] }) => {
        if (!labels.length) return <div className="text-sm text-slate-500">Không có dữ liệu</div>;

        const width = 700;
        const height = 180;
        const left = 54;
        const right = 20;
        const top = 15;
        const bottom = 35;
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

        const ticksCount = 4;
        const tickValues = Array.from({ length: ticksCount + 1 }, (_, i) => {
            const v = minValue + (i / ticksCount) * range;
            return Math.round(v);
        });

        // Calculate step for x-axis labels (show every Nth label)
        const labelCount = labels.length;
        let labelStep = 1;
        if (labelCount > 20) labelStep = Math.ceil(labelCount / 6);
        else if (labelCount > 10) labelStep = Math.ceil(labelCount / 5);

        const containerRef = useRef(null);
        const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null, date: null });

        const showTooltip = (ev, idx) => {
            const rect = containerRef.current?.getBoundingClientRect();
            const clientX = ev.clientX || ev.nativeEvent?.clientX || 0;
            const clientY = ev.clientY || ev.nativeEvent?.clientY || 0;
            const x = rect ? clientX - rect.left + 8 : clientX + 8;
            const y = rect ? clientY - rect.top - 28 : clientY - 28;
            const val = values[idx];
            const date = pointsRaw[idx]?.date || pointsRaw[idx]?.activityDate || labels[idx];
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
                        const shouldShow = i % labelStep === 0 || i === labels.length - 1;
                        if (!shouldShow) return null;
                        const x = left + (i / (labels.length - 1 || 1)) * chartWidth;
                        return (
                            <text key={i} x={x} y={height - bottom + 28} textAnchor="middle" fill="#64748b" fontSize="11" className="font-medium">
                                {lbl}
                            </text>
                        );
                    })}

                    <path d={pathData} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                    <path d={`${pathData} L ${pointsSvg[pointsSvg.length - 1].x} ${top + chartHeight} L ${pointsSvg[0].x} ${top + chartHeight} Z`} fill="#10b981" opacity="0.12" />

                    <defs>
                        <linearGradient id="gradOnscreen" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {pointsSvg.map((p, i) => (
                        <g key={i}>
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#10b981"
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
                        <div className="font-semibold">{tooltip.value?.toLocaleString?.() ?? tooltip.value}</div>
                        <div className="text-[11px] text-slate-500">{tooltip.date}</div>
                    </div>
                )}
            </div>
        );
    };

    const labels = points.map((p) => {
        try {
            const d = new Date(p.activityDate);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        } catch (e) {
            return p.activityDate;
        }
    });

    const values = points.map((p) => Number(p.totalActiveUsers) || 0);

    // Chart 2: Average Time Per User
    const avgTimeValues = points.map((p) => Math.round(Number(p.avgOnscreenSecondsPerUser) || 0));

    // Sort points by date for charts
    const sortedPoints = [...points].sort((a, b) => new Date(a.activityDate) - new Date(b.activityDate));

    const sortedLabels = sortedPoints.map((p) => {
        try {
            const d = new Date(p.activityDate);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        } catch (e) {
            return p.activityDate;
        }
    });

    const sortedValues = sortedPoints.map((p) => Number(p.totalActiveUsers) || 0);
    const sortedAvgTimeValues = sortedPoints.map((p) => Math.round(Number(p.avgOnscreenSecondsPerUser) || 0));

    // Prepare registration chart data
    const regLabels = regPoints.map((p) => {
        try {
            const d = new Date(p.date);
            return `${d.getDate()}`;
        } catch (e) {
            return p.date;
        }
    });
    const regValues = regPoints.map((p) => p.newUserCount || 0);

    // Chart 3: Active Users Last 7 Days (T2-CN, Nov 24-30, 2025)
    const last7dPoints = points.filter((p) => {
        const d = new Date(p.activityDate);
        return d >= new Date(2025, 10, 24) && d <= new Date(2025, 10, 30);
    }).sort((a, b) => new Date(a.activityDate) - new Date(b.activityDate));

    const last7dLabels = last7dPoints.map((p) => {
        const d = new Date(p.activityDate);
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days[d.getDay()];
    });

    const last7dValues = last7dPoints.map((p) => Number(p.totalActiveUsers) || 0);

    // Chart 4: Active Users Last 30 Days (Nov 1-30, 2025)
    const last30dPoints = points.filter((p) => {
        const d = new Date(p.activityDate);
        return d >= new Date(2025, 10, 1) && d <= new Date(2025, 10, 30);
    }).sort((a, b) => new Date(a.activityDate) - new Date(b.activityDate));

    const last30dLabels = last30dPoints.map((p) => {
        const d = new Date(p.activityDate);
        return `${d.getDate()}`;
    });

    const last30dValues = last30dPoints.map((p) => Number(p.totalActiveUsers) || 0);

    return (
        <div className="mt-3 border-t pt-3">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Onscreen Stats (Chatbox Activity)</h4>

            <div className="flex items-end justify-between mb-3 gap-3">
                <div />

                <div className="flex items-center gap-3">
                    <div className="text-center bg-slate-50 border rounded px-2 py-1">
                        <div className="text-xs text-slate-500">Total Active (all time)</div>
                        <div className="text-sm font-bold text-slate-900">{loading ? '...' : (totals.totalActiveUsersAllTime ?? '-')}</div>
                    </div>
                    <div className="text-center bg-slate-50 border rounded px-2 py-1">
                        <div className="text-xs text-slate-500">Total Onscreen Seconds</div>
                        <div className="text-sm font-bold text-slate-900">
                            {loading ? '...' : (totals.totalSystemOnscreenSecondsAllTime ? Math.round(totals.totalSystemOnscreenSecondsAllTime).toLocaleString() : '-')}
                        </div>
                    </div>
                    <div className="text-center bg-slate-50 border rounded px-2 py-1">
                        <div className="text-xs text-slate-500">Avg sec/user</div>
                        <div className="text-sm font-bold text-slate-900">
                            {loading ? '...' : (totals.avgOnscreenSecondsPerUserAllTime ? Math.round(totals.avgOnscreenSecondsPerUserAllTime) : '-')}
                        </div>
                    </div>
                    <div className="text-center bg-slate-50 border rounded px-2 py-1">
                        <div className="text-xs text-slate-500">Total Users</div>
                        <div className="text-sm font-bold text-slate-900">{regLoading ? '...' : (regTotalUsers ?? '-')}</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-xs text-slate-500">Đang tải dữ liệu onscreen...</div>
            ) : error ? (
                <div className="text-xs text-rose-600">Lỗi: {error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Chart 0: Daily New Users Registration */}
                    <div className="border rounded-lg p-2">
                        <div className="flex items-start justify-between">
                            <h5 className="text-xs font-semibold text-slate-700 mb-1">Số người đăng ký theo ngày (Tháng {selectedMonth}/{selectedYear})</h5>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="border rounded px-2 py-1 text-xs"
                                >
                                    {Array.from({ length: 12 }).map((_, idx) => (
                                        <option key={idx} value={idx + 1}>Tháng {idx + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="border rounded px-2 py-1 text-xs"
                                >
                                    {Array.from({ length: 6 }).map((_, idx) => {
                                        const y = now.getFullYear() - idx;
                                        return <option key={y} value={y}>{y}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                        {regLoading ? (
                            <div className="text-xs text-slate-500">Đang tải dữ liệu...</div>
                        ) : regError ? (
                            <div className="text-xs text-rose-600">Lỗi: {regError}</div>
                        ) : regValues.length > 0 ? (
                            <LineChart labels={regLabels} values={regValues} pointsRaw={regPoints} />
                        ) : (
                            <div className="text-xs text-slate-500">Không có dữ liệu</div>
                        )}
                    </div>

                    {/* Chart 1: Active Users (All Data) */}
                    <div className="border rounded-lg p-2">
                        <h5 className="text-xs font-semibold text-slate-700 mb-12">Active Users - Thời gian tính (All Data)</h5>
                        {/* <div className="flex items-center gap-2 mb-2">
                            <div>
                                <label className="text-[11px] text-slate-500 block">Start date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border rounded px-2 py-1 text-xs"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] text-slate-500 block">Max weeks</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={52}
                                    value={maxWeeks}
                                    onChange={(e) => setMaxWeeks(Number(e.target.value))}
                                    className="w-20 border rounded px-2 py-1 text-xs"
                                />
                            </div>

                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                                onClick={fetchOnscreen}
                            >
                                Áp dụng
                            </button>
                        </div> */}
                        <LineChart labels={sortedLabels} values={sortedValues} pointsRaw={sortedPoints} />
                    </div>

                    {/* Chart 2: Average Time Per User */}
                    <div className="border rounded-lg p-2">
                        <h5 className="text-xs font-semibold text-slate-700 mb-12">Average Time per User (seconds)</h5>
                        <LineChart labels={sortedLabels} values={sortedAvgTimeValues} pointsRaw={sortedPoints} />
                    </div>

                    {/* Chart 3: Active Users Last 7 Days (Nov 24-30) */}
                    <div className="border rounded-lg p-2">
                        <h5 className="text-xs font-semibold text-slate-700 mb-1">Active Users - Last 7 Days (T2-CN, Nov 24-30)</h5>
                        {last7dValues.length > 0 ? (
                            <LineChart labels={last7dLabels} values={last7dValues} pointsRaw={last7dPoints} />
                        ) : (
                            <div className="text-xs text-slate-500">Không có dữ liệu</div>
                        )}
                    </div>
                    {/* Chart 4: Active Users Last 30 Days (Nov 1-30) */}
                    <div className="border rounded-lg p-2">
                        <h5 className="text-xs font-semibold text-slate-700 mb-1">Active Users - Last 30 Days (Nov 1-30)</h5>
                        {last30dValues.length > 0 ? (
                            <LineChart labels={last30dLabels} values={last30dValues} pointsRaw={last30dPoints} />
                        ) : (
                            <div className="text-xs text-slate-500">Không có dữ liệu</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnscreenStats;
