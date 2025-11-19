import React from "react";
import { getJournalMoods } from "@/services/wellnessService";

function formatISO(date) {
    return date.toISOString();
}

function subDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
}

export default function MoodInsights({ title = "Nhật ký cảm xúc", showLegend = true } = {}) {
    const [range, setRange] = React.useState("week");
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [moods, setMoods] = React.useState([]);
    const [viewportWidth, setViewportWidth] = React.useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    React.useEffect(() => {
        function onResize() {
            setViewportWidth(window.innerWidth);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    function startOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = (day === 0 ? -6 : 1) - day; // Monday as start
        const res = new Date(d);
        res.setDate(d.getDate() + diff);
        res.setHours(0, 0, 0, 0);
        return res;
    }

    function startOfMonth(date) {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    }

    function startOfYear(date) {
        const d = new Date(date);
        return new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
    }

    const loadData = React.useCallback(async (r) => {
        setLoading(true);
        setError("");
        try {
            const now = new Date();
            let start;
            if (r === "week") start = startOfWeek(now);
            else if (r === "month") start = startOfMonth(now);
            else if (r === "year") start = startOfYear(now);
            else start = startOfWeek(now);

            const data = await getJournalMoods(formatISO(start), formatISO(now));
            // Sort descending by createdAt
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMoods(data);
        } catch (e) {
            setError(e?.message || "Failed to load moods");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadData(range);
    }, [loadData, range]);

    // Map raw 0-10 value to 1-7 emotional level
    function valueToLevel(v) {
        const n = Math.round(Number(v ?? 0));
        // Assume backend already uses 1..7 scale; clamp to be safe
        return Math.max(1, Math.min(7, n));
    }

    // Aggregate for chart
    const chartData = React.useMemo(() => {
        const now = new Date();
        let buckets = [];

        if (range === "week") {
            const start = startOfWeek(now);
            for (let i = 0; i < 7; i++) {
                const d = new Date(start);
                d.setDate(start.getDate() + i);
                buckets.push({ key: d.toDateString(), date: d, values: [] });
            }
        } else if (range === "month") {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                const d = new Date(now.getFullYear(), now.getMonth(), i, 0, 0, 0, 0);
                buckets.push({ key: d.toDateString(), date: d, values: [] });
            }
        } else if (range === "year") {
            for (let m = 0; m < 12; m++) {
                const d = new Date(now.getFullYear(), m, 1, 0, 0, 0, 0);
                buckets.push({ key: `${now.getFullYear()}-${m + 1}`, date: d, values: [] });
            }
        }

        const items = moods.map((m) => ({
            ...m,
            created: new Date(m.createdAt),
        }));

        for (const item of items) {
            if (range === "year") {
                const k = `${item.created.getFullYear()}-${item.created.getMonth() + 1}`;
                const bucket = buckets.find((b) => b.key === k);
                if (bucket) bucket.values.push(item);
            } else {
                const dayKey = new Date(
                    item.created.getFullYear(),
                    item.created.getMonth(),
                    item.created.getDate(),
                    0, 0, 0, 0
                ).toDateString();
                const bucket = buckets.find((b) => b.key === dayKey);
                if (bucket) bucket.values.push(item);
            }
        }

        return buckets.map((b) => {
            // representative = most recent entry in this bucket
            const sorted = b.values
                .map((it) => ({ level: valueToLevel(it.value), icon: it.moodIconCode, createdAt: it.createdAt }))
                // .map((it) => ({ level: valueToLevel(it.value), icon: it.moodIconCode, createdAt: it.createdAt }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const rep = sorted[0] || { level: 0, icon: "" };
            return { date: b.date, repLevel: rep.level, repIcon: rep.icon };
        });
    }, [moods, range]);

    const width = 800;
    const isMobile = viewportWidth < 768;
    const height = isMobile ? 700 : 380;
    const padding = { top: 24, right: 16, bottom: 36, left: 36 };
    const innerW = width - padding.left - padding.right - 20;
    const innerH = height - padding.top - padding.bottom;

    const maxVal = 7;
    const n = chartData.length || 1;
    const denom = Math.max(n - 1, 1);
    const points = chartData.map((d, i) => {
        const rawLevel = Number(d.repLevel || 0);
        const level = rawLevel > 0 ? Math.max(1, Math.min(7, Math.round(rawLevel))) : 0;
        const h = (level / maxVal) * innerH;
        const y = innerH - h;
        const x = (i / denom) * innerW + 20;
        const label = xLabel(d.date);
        const icon = decodeIcon(d.repIcon);
        return { x, y, label, icon, level };
    });

    function decodeIcon(s) {
        if (!s) return "";
        try {
            return JSON.parse(`"${s}"`);
        } catch {
            return s;
        }
    }

    function xLabel(d) {
        if (range === "week") return d.toLocaleDateString(undefined, { weekday: "short" });
        if (range === "month") return String(d.getDate());
        return d.toLocaleDateString(undefined, { month: "short" });
    }

    // Colors for trend segments
    const upColor = "#22c55e"; // green-500
    const downColor = "#ef4444"; // red-500
    const flatColor = "#94a3b8"; // slate-400

    return (
        <div className="mx-auto max-w-3xl px-4">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h1 className={(isMobile ? "text-lg" : "text-xl") + " font-semibold text-white"}>{title}</h1>
                <div className="inline-flex overflow-hidden rounded-md border border-gray-200">
                    {[
                        { key: "week", label: "Tuần này" },
                        { key: "month", label: "Tháng này" },
                    ].map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setRange(opt.key)}
                            className={
                                (isMobile ? "px-2 py-1 text-xs " : "px-3 py-1 text-sm ") +
                                (range === opt.key
                                    ? "bg-black text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50")
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div className="text-sm text-gray-500">Loading…</div>}
            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Chart */}
            {!loading && chartData.length > 0 && (
                <div
                    className="mb-6 w-full rounded-2xl overflow-visible sm:overflow-x-auto"
                    style={{
                        background: "linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
                        padding: 12,
                        // marginLeft: 18,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                        border: "1px solid rgba(148,163,184,0.15)",
                    }}
                >
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="block w-full mx-auto"
                        width="100%"
                        height="auto"
                        preserveAspectRatio="xMidYMid meet"
                        role="img"
                        aria-label="Mood chart"
                        style={{ display: "block", margin: "0 auto" }}
                    >
                        <defs>
                            {/* soft band gradient */}
                            <linearGradient id="bandGrad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#0e1628" />
                                <stop offset="100%" stopColor="#0b1220" />
                            </linearGradient>
                            {/* bar gradients */}
                            <linearGradient id="grad-1" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#64748b" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>
                            <linearGradient id="grad-2" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>
                            <linearGradient id="grad-3" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                            <linearGradient id="grad-4" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="grad-5" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                            <linearGradient id="grad-6" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#f87171" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                            <linearGradient id="grad-7" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#f472b6" />
                                <stop offset="100%" stopColor="#db2777" />
                            </linearGradient>
                            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.35" />
                            </filter>
                        </defs>
                        <g transform={`translate(${padding.left},${padding.top})`}>
                            {Array.from({ length: 7 }, (_, i) => 7 - i).map((lvl, idx) => {
                                const yBand = innerH - (lvl / maxVal) * innerH;
                                const bandH = innerH / maxVal;
                                return (
                                    <rect
                                        key={`band-${lvl}`}
                                        x={0}
                                        y={yBand}
                                        width={innerW}
                                        height={bandH}
                                        fill="url(#bandGrad)"
                                        opacity={idx % 2 === 0 ? 0.55 : 0.75}
                                    />
                                );
                            })}

                            {[1, 3, 5, 7].map((t) => {
                                const y = innerH - (t / maxVal) * innerH;
                                return (
                                    <g key={t}>
                                        <line x1={0} x2={innerW} y1={y} y2={y} stroke="#243244" strokeDasharray="3 3" strokeWidth={isMobile ? 1 : 0.75} />
                                        <text x={-12} y={y} textAnchor="end" dominantBaseline="middle" fontSize={isMobile ? 20 : 12} fill="#cbd5e1">
                                            {t}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Line segments colored by trend; only connect adjacent valid points */}
                            {points.slice(0, Math.max(points.length - 1, 0)).map((p, i) => {
                                const q = points[i + 1];
                                if (!q) return null;
                                if (p.level <= 0 || q.level <= 0) return null;
                                const stroke = q.level > p.level ? upColor : q.level < p.level ? downColor : flatColor;
                                return (
                                    <g key={`seg-${i}`}>
                                        <line
                                            x1={p.x}
                                            y1={p.y}
                                            x2={q.x}
                                            y2={q.y}
                                            stroke={stroke}
                                            strokeWidth={isMobile ? 3.5 : 2.5}
                                            strokeLinecap="round"
                                        />
                                    </g>
                                );
                            })}

                            {/* Points with icons */}
                            {points.map((p, i) => {
                                const iconOffsetY = 0; // center emoji vertically on the point
                                const iconY = p.y + iconOffsetY;
                                const iconBgR = isMobile ? 16 : 14;
                                const iconFontSize = isMobile ? 30 : 26;
                                return (
                                    <g key={`pt-${i}`}>
                                        {p.level > 0 && (
                                            <>
                                                {p.icon && (
                                                    <g pointerEvents="none">
                                                        <text
                                                            x={p.x}
                                                            y={iconY}
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                            fontSize={iconFontSize}
                                                        >
                                                            {p.icon}
                                                        </text>
                                                    </g>
                                                )}
                                            </>
                                        )}
                                        <text x={p.x} y={innerH + 20} textAnchor="middle" fontSize={isMobile ? 13 : 12} fill="#9aa9bf">
                                            {p.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </div>
            )}

            {/* Ghi chú: legend các mức cảm xúc */}
            {/* Legend */}
            {showLegend && (
                <div className={(isMobile ? "p-3" : "p-5") + " rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/70"}>
                    <div className={(isMobile ? "mb-3 text-xs" : "mb-4 text-sm") + " font-bold text-slate-800 dark:text-slate-100"}>Ghi chú</div>
                    <div className={"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 " + (isMobile ? "gap-2" : "gap-3")}>
                        {[
                            { name: "Tuyệt vọng", emoji: "😫" },
                            { name: "Buồn", emoji: "😢" },
                            { name: "Lo lắng", emoji: "😟" },
                            { name: "Bình thường", emoji: "😐" },
                            { name: "Hài lòng", emoji: "🙂" },
                            { name: "Hạnh phúc", emoji: "😊" },
                            { name: "Vui vẻ", emoji: "😁" },
                        ].map((it, idx) => (
                            <div
                                key={idx}
                                className={(isMobile ? "gap-1.5 p-3" : "gap-2 p-4") + " group relative flex flex-col items-center justify-center rounded-xl border border-slate-300/50 bg-white/50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:bg-white/90 hover:shadow-lg dark:border-slate-600/60 dark:bg-slate-800/50 dark:hover:border-indigo-500 dark:hover:bg-slate-800/90"}
                            >
                                {/* Name pill */}
                                <div className="relative z-10">
                                    <span className={(isMobile ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs") + " inline-block rounded-full bg-slate-900/95 font-semibold text-slate-100 shadow-lg ring-1 ring-slate-700/70 whitespace-nowrap"}>
                                        {it.name}
                                    </span>
                                </div>
                                {/* Sparkle */}
                                <span
                                    className="absolute top-1 right-1 text-xs text-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-gentle-pulse force-animate"
                                    style={{ "--anim-dur": "2s" }}
                                    aria-hidden
                                >
                                    ✨
                                </span>
                                {/* Emoji */}
                                <span
                                    className={(isMobile ? "text-3xl" : "text-4xl") + " transition-transform duration-300 group-hover:scale-110 animate-gentle-float force-animate"}
                                    style={{ animationDelay: `${(idx % 4) * 0.15}s`, "--anim-dur": "3s" }}
                                >
                                    {it.emoji}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


