import React from "react";

const data = [
    { name: "Electronics", value: 400, color: "#3b82f6" },
    { name: "Clothing", value: 300, color: "#8b5cf6" },
    { name: "Food", value: 200, color: "#ec4899" },
    { name: "Books", value: 100, color: "#f59e0b" },
];

const PieChart = () => {
    const size = 200;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90; // Start from top

    const paths = data.map((d, i) => {
        const percentage = d.value / total;
        const angle = percentage * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
        const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
        const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
        const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
        ].join(" ");

        // Label position
        const labelAngle = (startAngle + endAngle) / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
        const labelY = centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);

        return {
            path: pathData,
            color: d.color,
            name: d.name,
            percentage: (percentage * 100).toFixed(0),
            labelX,
            labelY,
        };
    });

    return (
        <div className="w-full flex items-center justify-center" style={{ height: "300px" }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {paths.map((path, i) => (
                    <g key={i}>
                        <path
                            d={path.path}
                            fill={path.color}
                            stroke="#fff"
                            strokeWidth="2"
                            opacity="0.9"
                        />
                        <text
                            x={path.labelX}
                            y={path.labelY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#fff"
                            fontSize="12"
                            fontWeight="600">
                            {path.percentage}%
                        </text>
                    </g>
                ))}
            </svg>
            <div className="ml-8 space-y-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: d.color }}
                        />
                        <span className="text-sm text-slate-700">{d.name}</span>
                        <span className="text-sm text-slate-500">
                            ({((d.value / total) * 100).toFixed(0)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;
