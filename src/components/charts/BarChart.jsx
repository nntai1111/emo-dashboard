import React from "react";

const data = [
    { name: "Jan", sales: 4000, orders: 2400 },
    { name: "Feb", sales: 3000, orders: 1398 },
    { name: "Mar", sales: 5000, orders: 9800 },
    { name: "Apr", sales: 2780, orders: 3908 },
    { name: "May", sales: 1890, orders: 4800 },
    { name: "Jun", sales: 2390, orders: 3800 },
];

const BarChart = () => {
    const width = 600;
    const height = 300;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length / 3;
    const gap = barWidth * 0.3;

    const maxValue = Math.max(
        ...data.map((d) => Math.max(d.sales, d.orders))
    );

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

                {/* Bars */}
                {data.map((d, i) => {
                    const x = padding + (i / data.length) * chartWidth + gap;
                    const salesHeight = (d.sales / maxValue) * chartHeight;
                    const ordersHeight = (d.orders / maxValue) * chartHeight;

                    return (
                        <g key={i}>
                            {/* Sales bar */}
                            <rect
                                x={x}
                                y={padding + chartHeight - salesHeight}
                                width={barWidth}
                                height={salesHeight}
                                fill="#3b82f6"
                                rx="4"
                            />
                            {/* Orders bar */}
                            <rect
                                x={x + barWidth + gap}
                                y={padding + chartHeight - ordersHeight}
                                width={barWidth}
                                height={ordersHeight}
                                fill="#8b5cf6"
                                rx="4"
                            />
                            {/* Label */}
                            <text
                                x={x + barWidth}
                                y={height - padding + 20}
                                textAnchor="middle"
                                fill="#64748b"
                                fontSize="12"
                                className="font-medium">
                                {d.name}
                            </text>
                        </g>
                    );
                })}

                {/* Legend */}
                <g transform={`translate(${width - padding - 100}, ${padding})`}>
                    <rect x="0" y="0" width="12" height="12" fill="#3b82f6" rx="2" />
                    <text x="18" y="10" fill="#64748b" fontSize="12">Sales</text>
                    <rect x="0" y="20" width="12" height="12" fill="#8b5cf6" rx="2" />
                    <text x="18" y="30" fill="#64748b" fontSize="12">Orders</text>
                </g>
            </svg>
        </div>
    );
};

export default BarChart;
