import React from "react";

const data = [
    { name: "Jan", users: 4000 },
    { name: "Feb", users: 3000 },
    { name: "Mar", users: 5000 },
    { name: "Apr", users: 2780 },
    { name: "May", users: 1890 },
    { name: "Jun", users: 2390 },
    { name: "Jul", users: 3490 },
];

const AreaChart = () => {
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data.map((d) => d.users));
    const minValue = Math.min(...data.map((d) => d.users));
    const range = maxValue - minValue || 1;

    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.users - minValue) / range) * chartHeight;
        return { x, y, ...d };
    });

    const pathData = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    const areaPath = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

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

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area */}
                <path d={areaPath} fill="url(#areaGradient)" />

                {/* Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

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

                {/* Dots */}
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="#8b5cf6" />
                ))}
            </svg>
        </div>
    );
};

export default AreaChart;
