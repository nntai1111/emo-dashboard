import React from "react";

const BehaviorMock = () => {
    // Hardcoded mock metrics for Tab 1
    const chat = {
        activeUsers: 1250,
        avgSessions: 3.4,
        retention: "28%",
    };

    const posts = {
        views: 84230,
        interactions: 4210,
        avgViewPerPost: 512,
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Chatbot Activity (Mock)</h4>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{chat.activeUsers.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 mt-1">Người dùng hoạt động</div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-semibold">Avg {chat.avgSessions}</div>
                        <div className="text-xs text-slate-500">sessions/user</div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">Retention: <span className="font-semibold text-emerald-600">{chat.retention}</span></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Post Interactions (Mock)</h4>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">{posts.views.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 mt-1">Lượt xem</div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-semibold">{posts.interactions.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">Tương tác</div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">Avg views/post: <span className="font-semibold text-emerald-600">{posts.avgViewPerPost}</span></div>
            </div>
        </div>
    );
};

export default BehaviorMock;
