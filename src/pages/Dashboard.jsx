import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Users, DollarSign, TrendingUp, BarChart3, ShoppingCart } from "lucide-react";
import { authService } from "../services/authService";
import { paymentsService } from "../services/apiService";
// retention chart moved to OnscreenStats
import PostService from "../components/charts/PostService";
import ChatService from "../components/charts/ChatService";
import BehaviorMock from "../components/charts/BehaviorMock";
import DailyPaymentsChart from "../components/charts/DailyPaymentsChart";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [paymentsSummary, setPaymentsSummary] = useState({ totalCount: 0 });
    const [paymentsData, setPaymentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('behavior');

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

    // Load completed payments only when revenue tab is active
    useEffect(() => {
        let mounted = true;

        const loadPayments = async () => {
            try {
                setLoading(true);
                const res = await paymentsService.getPayments({
                    pageIndex: 1,
                    pageSize: 1000,
                    status: "Completed",
                    sortOrder: "desc",
                });

                if (!mounted) return;

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

        if (activeTab === 'revenue') {
            loadPayments();
        }

        return () => { mounted = false; };
    }, [activeTab]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">
                            <span className="text-pink-700">EMO</span><span className="text-purple-800">EASE</span>
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

            {/* Main Content with Tabs */}
            <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">


                    {/* Tabs */}
                    <div className="border-b border-slate-100 mb-6">
                        <nav className="flex space-x-2" role="tablist" aria-label="Dashboard tabs">
                            <button
                                role="tab"
                                aria-selected={activeTab === 'behavior'}
                                onClick={() => setActiveTab('behavior')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'behavior' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                User Behavior Analysis
                            </button>

                            <button
                                role="tab"
                                aria-selected={activeTab === 'cohort'}
                                onClick={() => setActiveTab('cohort')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'cohort' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                Cohort
                            </button>

                            <button
                                role="tab"
                                aria-selected={activeTab === 'revenue'}
                                onClick={() => setActiveTab('revenue')}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'revenue' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                Doanh thu
                            </button>
                        </nav>
                    </div>

                    {/* Tab Panels */}
                    <div>
                        {activeTab === 'behavior' && (
                            <div>
                                <BehaviorMock />

                            </div>
                        )}

                        {activeTab === 'cohort' && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Cohort Retention</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5">
                                            <h3 className="text-lg font-bold">Bài viết (Post)</h3>
                                            <p className="text-xs opacity-90 mt-1">Tỷ lệ người dùng quay lại xem bài</p>
                                        </div>
                                        <div className="p-4">
                                            <PostService />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5">
                                            <h3 className="text-lg font-bold">Chatbot AI</h3>
                                            <p className="text-xs opacity-90 mt-1">Tỷ lệ người dùng quay lại chat</p>
                                        </div>
                                        <div className="p-4">
                                            <ChatService />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'revenue' && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-800">Doanh thu & lượt mua theo ngày</h3>
                                    <div className="text-sm text-slate-600">
                                        Tổng người mua gói: <span className="font-bold text-rose-600 text-lg">{paymentsSummary.totalCount}</span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                    <DailyPaymentsChart payments={paymentsData} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div >
    );
};

export default Dashboard;