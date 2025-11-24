import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Users, DollarSign, TrendingUp, BarChart3, ShoppingCart } from "lucide-react";
import { authService } from "../services/authService";
import { paymentsService } from "../services/apiService";
import PostService from "../components/charts/PostService";
import ChatService from "../components/charts/ChatService";
import DailyPaymentsChart from "../components/charts/DailyPaymentsChart";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [paymentsSummary, setPaymentsSummary] = useState({ totalCount: 0 });
    const [paymentsData, setPaymentsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            await authService.logoutRemote();
        } catch (e) {
            console.warn("logoutRemote failed", e);
        } finally {
            localStorage.clear();
            window.dispatchEvent(new CustomEvent("app:logout"));
            navigate("/login");
        }
    };

    // Load completed payments
    useEffect(() => {
        let mounted = true;

        const loadPayments = async () => {
            try {
                setLoading(true);
                // Gọi API với status=Completed để lấy tất cả giao dịch thành công
                const res = await paymentsService.getPayments({
                    pageIndex: 1,
                    pageSize: 1000, // Lấy nhiều để đủ dữ liệu vẽ chart
                    status: "Completed",
                    sortOrder: "desc",
                });

                if (!mounted) return;

                // Xử lý nhiều cấu trúc response có thể có
                const data = res?.payments?.data || res?.data || res || [];
                const totalCount = res?.payments?.totalCount || res?.totalCount || data.length;

                setPaymentsSummary({ totalCount });
                setPaymentsData(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load payments:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPayments();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Thống Kê <span className="text-pink-700">EMO</span><span className="text-purple-800">EASE</span>
                        </h1>
                        <div className="flex items-center gap-4">

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div >
            </header >

            {/* Main Content */}
            < main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >

                {/* Payments Daily Chart */}
                <div div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8" >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Doanh thu & lượt mua theo ngày</h2>
                        <div className="text-sm text-slate-600 mt-2 sm:mt-0">
                            Tổng người mua gói: <span className="font-bold text-rose-600 text-lg">{paymentsSummary.totalCount}</span>
                        </div>
                    </div>
                    <DailyPaymentsChart payments={paymentsData} />
                </div >
                {/* Cohort Retention */}
                <div div className="mt-12" >
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                        Phân tích Retention theo Cohort tuần
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5">
                                <h3 className="text-lg font-bold">Bài viết (Post)</h3>
                                <p className="text-xs opacity-90 mt-1">Tỷ lệ người dùng quay lại xem bài</p>
                            </div>
                            <div className="">
                                <PostService maxWeeksOverride={6} compact />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5">
                                <h3 className="text-lg font-bold">Chatbot AI</h3>
                                <p className="text-xs opacity-90 mt-1">Tỷ lệ người dùng quay lại chat</p>
                            </div>
                            <div className="">
                                <ChatService maxWeeksOverride={6} compact />
                            </div>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
};

export default Dashboard;