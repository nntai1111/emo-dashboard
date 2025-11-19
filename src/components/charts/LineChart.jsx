import React from "react";

const data = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
];

const LineChart = () => {
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.value - minValue) / range) * chartHeight;
        return { x, y, ...d };
    });

    const pathData = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => {
                    const y = padding + (i / 4) * chartHeight;
                    return (
                        <line
                            key={i}
                            x1={padding}
                            y1={y}
                            x2={width - padding}
                            y2={y}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                        />
                    );
                })}

                {/* X-axis labels */}
                {data.map((d, i) => {
                    const x = padding + (i / (data.length - 1)) * chartWidth;
                    return (
                        <text
                            key={i}
                            x={x}
                            y={height - padding + 20}
                            textAnchor="middle"
                            fill="#64748b"
                            fontSize="12"
                            className="font-medium">
                            {d.name}
                        </text>
                    );
                })}

                {/* Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Area fill */}
                <path
                    d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                    fill="url(#gradient)"
                    opacity="0.2"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Dots */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
                        <circle cx={p.x} cy={p.y} r="8" fill="#3b82f6" opacity="0.2" />
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default LineChart;
