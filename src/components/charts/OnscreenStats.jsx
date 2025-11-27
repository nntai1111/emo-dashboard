import React, { useEffect, useState, useRef } from "react";
import { tokenManager } from "../../services/tokenManager";

const OnscreenStats = () => {
    const [points, setPoints] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [maxWeeks, setMaxWeeks] = useState(7);

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

    useEffect(() => {
        fetchOnscreen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // LineChart component (reusable)
    const LineChart = ({ labels, values, pointsRaw = [] }) => {
        if (!labels.length) return <div className="text-sm text-slate-500">Không có dữ liệu</div>;

        const width = 700;
        const height = 220;
        const left = 54;
        const right = 20;
        const top = 20;
        const bottom = 44;
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
        <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Onscreen Stats (Chatbox Activity)</h4>

            <div className="flex items-end justify-between mb-4 gap-3">
                <div className="flex items-end gap-3">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Start date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Max weeks</label>
                        <input
                            type="number"
                            min={1}
                            max={52}
                            value={maxWeeks}
                            onChange={(e) => setMaxWeeks(Number(e.target.value))}
                            className="w-24 border rounded px-2 py-1 text-sm"
                        />
                    </div>

                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm font-medium"
                        onClick={fetchOnscreen}
                    >
                        Áp dụng
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-center bg-slate-50 border rounded px-3 py-2">
                        <div className="text-xs text-slate-500">Total Active (all time)</div>
                        <div className="text-lg font-bold text-slate-900">{loading ? '...' : (totals.totalActiveUsersAllTime ?? '-')}</div>
                    </div>
                    <div className="text-center bg-slate-50 border rounded px-3 py-2">
                        <div className="text-xs text-slate-500">Total Onscreen Seconds</div>
                        <div className="text-lg font-bold text-slate-900">
                            {loading ? '...' : (totals.totalSystemOnscreenSecondsAllTime ? Math.round(totals.totalSystemOnscreenSecondsAllTime).toLocaleString() : '-')}
                        </div>
                    </div>
                    <div className="text-center bg-slate-50 border rounded px-3 py-2">
                        <div className="text-xs text-slate-500">Avg sec/user</div>
                        <div className="text-lg font-bold text-slate-900">
                            {loading ? '...' : (totals.avgOnscreenSecondsPerUserAllTime ? Math.round(totals.avgOnscreenSecondsPerUserAllTime) : '-')}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-sm text-slate-500">Đang tải dữ liệu onscreen...</div>
            ) : error ? (
                <div className="text-sm text-rose-600">Lỗi: {error}</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {/* Chart 1: Active Users (All Data) */}
                    <div className="border rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-slate-700 mb-2">Active Users - Thời gian tính (All Data)</h5>
                        <LineChart labels={labels} values={values} pointsRaw={points} />
                    </div>

                    {/* Chart 2: Average Time Per User */}
                    <div className="border rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-slate-700 mb-2">Average Time per User (seconds)</h5>
                        <LineChart labels={labels} values={avgTimeValues} pointsRaw={points} />
                    </div>

                    {/* Chart 3: Active Users Last 7 Days (Nov 24-30) */}
                    <div className="border rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-slate-700 mb-2">Active Users - Last 7 Days (T2-CN, Nov 24-30)</h5>
                        {last7dValues.length > 0 ? (
                            <LineChart labels={last7dLabels} values={last7dValues} pointsRaw={last7dPoints} />
                        ) : (
                            <div className="text-xs text-slate-500">Không có dữ liệu</div>
                        )}
                    </div>

                    {/* Chart 4: Active Users Last 30 Days (Nov 1-30) */}
                    <div className="border rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-slate-700 mb-2">Active Users - Last 30 Days (Nov 1-30)</h5>
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
