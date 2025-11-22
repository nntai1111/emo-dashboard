import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, User, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { authService } from "../services/authService";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import AreaChart from "../components/charts/AreaChart";
import PostService from "../components/charts/PostService";           // ← PostCohortHeatmap
import ChatService from "../components/charts/ChatService";           // ← ChatbotCohortHeatmap

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logoutRemote();
        } catch (e) {
            console.warn("logoutRemote failed, falling back to local clear", e);
            try {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("auth_user");
                window.dispatchEvent(new CustomEvent("app:logout"));
            } catch { }
        } finally {
            navigate("/login");
        }
    };

    const stats = [
        { title: "Total Users", value: "12,345", change: "+12.5%", icon: Users, color: "bg-blue-500" },
        { title: "Revenue", value: "$45,231", change: "+8.2%", icon: DollarSign, color: "bg-green-500" },
        { title: "Active Sessions", value: "2,341", change: "+5.1%", icon: TrendingUp, color: "bg-purple-500" },
        { title: "Conversion Rate", value: "3.24%", change: "+2.4%", icon: BarChart3, color: "bg-orange-500" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <User className="w-5 h-5" />
                                <span className="font-medium">{user?.fullName || user?.email || "User"}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                            </div>
                            <h3 className="text-sm font-medium text-slate-600 mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h2>
                        <LineChart />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Sales</h2>
                        <BarChart />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">User Growth</h2>
                        <AreaChart />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h2>
                        <PieChart />
                    </div>
                </div>

                {/* ===== 2 COHORT HEATMAP - NHỎ GỌN & ĐẸP ===== */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                        Phân tích Retention theo Cohort tuần
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* POST COHORT */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            {/* <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5">
                                <h3 className="text-lg font-bold">Bài viết (Post)</h3>
                                <p className="text-xs opacity-90 mt-1">Tỷ lệ người dùng quay lại xem bài</p>
                            </div> */}
                            <div className="overflow-x-auto">
                                <div className="p-5">
                                    <PostService maxWeeksOverride={6} compact />
                                </div>
                            </div>
                        </div>

                        {/* CHATBOT COHORT */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5">
                                <h3 className="text-lg font-bold">Chatbot AI</h3>
                                <p className="text-xs opacity-90 mt-1">Tỷ lệ người dùng quay lại chat</p>
                            </div> */}
                            <div className="overflow-x-auto">
                                <div className="p-5">
                                    <ChatService maxWeeksOverride={6} compact />
                                </div>
                            </div>
                        </div>

                    </div>


                </div>

            </main>
        </div>
    );
};

export default Dashboard;