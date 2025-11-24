import React, { useMemo, useEffect, useState } from "react";
import { paymentsService } from "../../services/apiService";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { format } from "date-fns";
import { TrendingUp, DollarSign, Users } from "lucide-react";

const DailyPaymentsChart = ({ payments: propsPayments }) => {
    const [payments, setPayments] = useState(null);
    const [loading, setLoading] = useState(!propsPayments);

    useEffect(() => {
        let mounted = true;
        if (!propsPayments) {
            (async () => {
                try {
                    setLoading(true);
                    const res = await paymentsService.getPayments({
                        pageIndex: 1,
                        pageSize: 1000,
                        status: "Completed",
                        sortOrder: "desc"
                    });
                    const data = res?.payments?.data || res?.data || res || [];
                    if (mounted) setPayments(Array.isArray(data) ? data : []);
                } catch (e) {
                    console.warn(e);
                    if (mounted) setPayments([]);
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setPayments(propsPayments);
            setLoading(false);
        }
        return () => { mounted = false; };
    }, [propsPayments]);

    const data = useMemo(() => {
        if (!payments || payments.length === 0) return [];

        // Group by calendar day in UTC to avoid local timezone shifts
        const map = {};
        payments.forEach(p => {
            const created = p?.createdAt ? new Date(p.createdAt) : null;
            if (!created || isNaN(created.getTime())) return; // skip invalid dates

            // Use UTC-based day/month so events that were created in UTC
            // don't get shifted to previous/next day by the client's timezone.
            const day = String(created.getUTCDate()).padStart(2, "0");
            const month = String(created.getUTCMonth() + 1).padStart(2, "0");
            const date = `${day}/${month}`;

            // Use a UTC midnight timestamp for stable chronological sorting
            const fullDate = new Date(Date.UTC(created.getUTCFullYear(), created.getUTCMonth(), created.getUTCDate()));

            if (!map[date]) {
                map[date] = { date, fullDate, revenue: 0, orders: 0 };
            }
            map[date].revenue += Number(p.totalAmount || 0);
            map[date].orders += 1;
        });

        return Object.values(map)
            .sort((a, b) => a.fullDate - b.fullDate)
            .slice(-30);
    }, [payments]);

    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
    const totalOrders = data.reduce((s, d) => s + d.orders, 0);
    const avgAOV = totalOrders ? totalRevenue / totalOrders : 0;

    const formatVND = (v) => new Intl.NumberFormat("vi-VN").format(Math.round(v)) + "đ";

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="h-64 bg-gray-100 rounded-xl"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                Không có dữ liệu giao dịch
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    {payload.map((entry, i) => (
                        <p key={i} className="text-sm mt-1" style={{ color: entry.color }}>
                            {entry.name === "Doanh thu" ? "Doanh thu" : "Đơn hàng"}:{" "}
                            <strong>
                                {entry.name === "Doanh thu" ? formatVND(entry.value) : entry.value}
                            </strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 opacity-90" />
                        <div>
                            <p className="text-green-100 text-sm">Tổng doanh thu</p>
                            <p className="text-2xl font-bold">{formatVND(totalRevenue)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 opacity-90" />
                        <div>
                            <p className="text-blue-100 text-sm">Số người mua</p>
                            <p className="text-2xl font-bold">{totalOrders}</p>
                        </div>
                    </div>
                </div>


            </div>

            {/* Two Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Doanh thu */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Doanh thu theo ngày</h3>
                    <p className="text-sm text-gray-500 mb-6">30 ngày gần nhất</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 6" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}tr` : `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#revenueGradient)"
                                name="Doanh thu"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Số đơn hàng */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Số người mua gói</h3>
                    <p className="text-sm text-gray-500 mb-6">Lượt mua theo ngày</p>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 6" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#ordersGradient)"
                                name="Đơn hàng"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>


        </div>
    );
};

export default DailyPaymentsChart;