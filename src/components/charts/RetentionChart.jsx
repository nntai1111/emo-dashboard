import React from "react";

const RetentionChart = ({ data = [], height = 320 }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Không có dữ liệu retention
            </div>
        );
    }

    const chartData = data.map((d) => ({
        week: `W${d.weekNumber}`,
        retention: Number(d.retentionRatePercent.toFixed(2)),
        retained: d.retainedUsers,
        eligible: d.eligibleUsers,
    }));

    const maxY = 100;
    const padding = { top: 70, right: 70, bottom: 80, left: 60 };
    const width = 500;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = chartData.map((i, idx) => ({
        ...i,
        x: padding.left + (idx / (chartData.length - 1)) * chartWidth,
        y: padding.top + chartHeight * (1 - i.retention / maxY),
    }));

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return (
        <div className="w-max-5xl" >
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">

                {/* Grid + Y labels */}
                {[0, 25, 50, 75, 100].map((val) => {
                    const y = padding.top + (chartHeight * (100 - val)) / 100;
                    return (
                        <g key={val}>
                            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray={val === 0 ? "0" : "6,6"} />
                            <text x={padding.left - 12} y={y + 5} textAnchor="end" fill="#64748b" fontSize="13" fontWeight={val === 0 ? "bold" : "normal"}>
                                {val}%
                            </text>
                        </g>
                    );
                })}

                {/* Cảnh báo lớn nếu Week 1 < 10% */}
                {chartData[0].retention < 10 && (
                    <text x={width / 2} y={38} textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="bold">
                        CẢNH BÁO: Retention Week 1 chỉ {chartData[0].retention}%
                    </text>
                )}

                {/* Đường line + area */}
                <path d={`${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`}
                    fill="#ef4444" opacity="0.15" />
                <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />

                {/* Điểm + thông tin chi tiết dạng hộp nhỏ phía dưới */}
                {points.map((p, i) => (
                    <g key={i}>
                        {/* Đường line đỏ */}
                        <circle cx={p.x} cy={p.y} r="8" fill="#ef4444" stroke="#fff" strokeWidth="4" />

                        {/* Hộp thông tin phía dưới trục X */}
                        <g transform={`translate(${p.x}, ${height - padding.bottom + 55})`}>
                            <rect x="-58" y="-5" width="116" height="54" rx="8" fill="#1e293b" opacity="0.92" />
                            <text x="0" y="12" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                                {p.week}
                            </text>
                            <text x="0" y="28" textAnchor="middle" fill="#fca5a5" fontSize="15" fontWeight="bold">
                                {p.retention}%
                            </text>
                            <text x="0" y="44" textAnchor="middle" fill="#e2e8f0" fontSize="11">
                                {p.retained} / {p.eligible} người
                            </text>
                        </g>
                    </g>
                ))}


            </svg>
        </div>
    );
};

export default RetentionChart;