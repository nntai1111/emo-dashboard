import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Heart, AlertTriangle, Scale, BookOpen } from "lucide-react";

const CommunityRulesPage = () => {
    const [showFullRules, setShowFullRules] = useState(false);

    const openFullRules = () => {
        setShowFullRules(true);
    };

    const closeFullRules = () => {
        setShowFullRules(false);
    };

    const quickRules = [
        {
            title: "Giao tiếp tôn trọng",
            icon: "💬",
            description: "Hãy trao đổi bằng thái độ lịch sự, cảm thông và thấu hiểu. Tôn trọng quan điểm, cảm xúc của người khác tránh lời lẽ công kích, phán xét hoặc gây tổn thương."
        },
        {
            title: "Hỗ trợ, không phán xét",
            icon: "🤝",
            description: "Lắng nghe với sự quan tâm chân thành. Thay vì chỉ trích hay so sánh, hãy công nhận cảm xúc của người khác và thể hiện sự đồng hành một cách tinh tế."
        },
        {
            title: "Giữ đúng chủ đề",
            icon: "🎯",
            description: "Mọi thảo luận nên xoay quanh chủ đề về sức khỏe cảm xúc, tinh thần, trải nghiệm cá nhân hoặc các vấn đề liên quan đến cộng đồng EmoEase."
        },
        {
            title: "Tôn trọng quyền riêng tư",
            icon: "🔒",
            description: "Không chia sẻ thông tin cá nhân như họ tên đầy đủ, địa chỉ, số điện thoại, hình ảnh nhận diện... để đảm bảo an toàn và ẩn danh cho mọi thành viên."
        }
    ];

    const mandatoryRules = [
        "Cấm ngôn từ kỳ thị và thù ghét",
        "Cấm quấy rối, bắt nạt hoặc xúc phạm",
        "Cấm hành vi đe dọa, bạo lực hoặc vi phạm pháp luật",
        "Cấm nội dung tiêu cực về bản thân",
        "Cấm nội dung không phù hợp hoặc hẹn hò",
        "Cấm spam, quảng cáo và mời chào cá nhân",
        "Cấm mạo danh hoặc giả mạo danh tính"
    ];

    const fullRules = {
        guidelines: [
            {
                title: "Giao tiếp tôn trọng",
                description: "Hãy trao đổi bằng thái độ lịch sự, cảm thông và thấu hiểu. Tôn trọng quan điểm, cảm xúc của người khác tránh lời lẽ công kích, phán xét hoặc gây tổn thương.",
                icon: Heart
            },
            {
                title: "Hỗ trợ, không phán xét",
                description: "Lắng nghe với sự quan tâm chân thành. Thay vì chỉ trích hay so sánh, hãy công nhận cảm xúc của người khác và thể hiện sự đồng hành một cách tinh tế.",
                icon: Heart
            },
            {
                title: "Phản hồi mang tính xây dựng",
                description: "Khi đóng góp ý kiến hoặc góp ý, hãy làm với thiện ý, nhẹ nhàng và mang mục đích giúp người khác tốt hơn.",
                icon: Heart
            },
            {
                title: "Giữ đúng chủ đề",
                description: "Mọi thảo luận nên xoay quanh chủ đề về sức khỏe cảm xúc, tinh thần, trải nghiệm cá nhân hoặc các vấn đề liên quan đến cộng đồng EmoEase.",
                icon: Heart
            },
            {
                title: "Tôn trọng quyền riêng tư",
                description: "Không chia sẻ thông tin cá nhân như họ tên đầy đủ, địa chỉ, số điện thoại, hình ảnh nhận diện... để đảm bảo an toàn và ẩn danh cho mọi thành viên.",
                icon: Shield
            },
            {
                title: "Ghi rõ nguồn trích dẫn",
                description: "Khi chia sẻ bài viết, nghiên cứu hoặc trích dẫn, vui lòng ghi rõ nguồn để thể hiện sự tôn trọng bản quyền và minh bạch thông tin.",
                icon: BookOpen
            },
            {
                title: "Tự điều chỉnh & Báo cáo",
                description: "Nếu bắt gặp nội dung không phù hợp, hãy sử dụng chức năng báo cáo để Ban quản trị xem xét và xử lý.",
                icon: AlertTriangle
            }
        ],
        mandatory: [
            {
                title: "Cấm ngôn từ kỳ thị và thù ghét",
                description: "Không được sử dụng bất kỳ lời nói hay hành vi nào mang tính phân biệt về giới tính, tôn giáo, xuất thân, khuynh hướng, hay khả năng cá nhân.",
                icon: AlertTriangle
            },
            {
                title: "Cấm quấy rối, bắt nạt hoặc xúc phạm",
                description: "Mọi hành vi cố ý làm tổn thương, công kích hoặc nhắm vào người khác đều bị nghiêm cấm và sẽ bị xóa bỏ.",
                icon: AlertTriangle
            },
            {
                title: "Cấm hành vi đe dọa, bạo lực hoặc vi phạm pháp luật",
                description: "Các hành vi, lời nói mang tính đe dọa, kích động, hoặc có dấu hiệu vi phạm pháp luật sẽ bị xử lý nghiêm và báo cáo tới cơ quan chức năng khi cần thiết.",
                icon: AlertTriangle
            },
            {
                title: "Cấm nội dung tiêu cực về bản thân",
                description: "EmoEase không phải là nền tảng hỗ trợ khẩn cấp. Các nội dung thể hiện ý định làm tổn thương bản thân hoặc mô tả hành vi nguy hiểm sẽ bị gỡ bỏ, đồng thời người đăng được khuyến khích tìm kiếm sự hỗ trợ từ chuyên gia hoặc tổ chức đáng tin cậy.",
                icon: AlertTriangle
            },
            {
                title: "Cấm nội dung không phù hợp hoặc hẹn hò",
                description: "Cộng đồng tập trung vào chia sẻ và hỗ trợ cảm xúc, không phải nơi cho các mục đích hẹn hò hay trao đổi nội dung nhạy cảm.",
                icon: AlertTriangle
            },
            {
                title: "Cấm spam, quảng cáo và mời chào cá nhân",
                description: "Mọi hình thức quảng bá, rao bán, hoặc chia sẻ nội dung không liên quan sẽ bị xóa.",
                icon: AlertTriangle
            },
            {
                title: "Cấm mạo danh hoặc giả mạo danh tính",
                description: "Không được sử dụng thông tin hoặc hình ảnh của người khác để tạo tài khoản, gây hiểu lầm hoặc trục lợi.",
                icon: AlertTriangle
            }
        ],
        measures: [
            "Nhắc nhở nhẹ hoặc cảnh cáo chính thức",
            "Hạn chế tạm thời (quyền đăng bài, bình luận, nhắn tin)",
            "Xóa bài viết hoặc nội dung vi phạm",
            "Cấm tài khoản tạm thời hoặc vĩnh viễn (trường hợp nghiêm trọng)",
            "Tiếp nhận và xử lý khiếu nại minh bạch"
        ],
        philosophy: [
            {
                title: "Minh bạch & Công bằng",
                description: "Mọi quyết định xử lý đều được thông báo rõ ràng, kèm lý do cụ thể để người dùng hiểu và rút kinh nghiệm."
            },
            {
                title: "Ưu tiên An toàn",
                description: "Các nội dung có nguy cơ ảnh hưởng tiêu cực đến sức khỏe tinh thần hoặc an toàn cá nhân sẽ được xem xét và xử lý khẩn cấp."
            },
            {
                title: "Hướng dẫn & Giáo dục",
                description: "Trước khi áp dụng biện pháp xử lý, EmoEase ưu tiên giải thích, hướng dẫn và hỗ trợ người dùng điều chỉnh hành vi tích cực."
            },
            {
                title: "Quyền Khiếu nại",
                description: "Thành viên có quyền gửi khiếu nại nếu cho rằng quyết định xử lý chưa chính xác; mọi phản hồi sẽ được xem xét công bằng và tôn trọng."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="container mx-auto px-1 sm:px-2 py-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6"
                    >
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-lg p-6 mb-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4">
                                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                Quy tắc cộng đồng
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Cùng nhau xây dựng một cộng đồng an toàn, thân thiện và hỗ trợ lẫn nhau
                            </p>
                        </div>
                    </motion.div>

                    {/* Quick Rules Summary */}
                    <div className="space-y-3 mb-6">
                        {quickRules.map((rule, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-[#1C1C1E] rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">{rule.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                            {rule.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {rule.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mandatory Rules List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md border border-red-200 dark:border-red-800 p-4 mb-6"
                    >
                        <div className="flex items-center space-x-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <h3 className="font-bold text-red-800 dark:text-red-200">
                                Quy tắc bắt buộc
                            </h3>
                        </div>
                        <ul className="space-y-1">
                            {mandatoryRules.map((rule, index) => (
                                <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* View Full Details Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openFullRules}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Xem chi tiết đầy đủ
                        </motion.button>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-6"
                    >
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Cảm ơn bạn đã đọc và tuân thủ quy tắc!</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Cùng nhau xây dựng một cộng đồng EmoEase tích cực và hỗ trợ lẫn nhau.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Full Rules Modal */}
            <AnimatePresence>
                {showFullRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeFullRules}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                    Quy tắc cộng đồng đầy đủ
                                </h2>
                                <button
                                    onClick={closeFullRules}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="space-y-8">
                                    {/* A. Hướng dẫn ứng xử */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                            <Heart className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                                            A. HƯỚNG DẪN ỨNG XỬ
                                        </h3>
                                        <div className="space-y-4">
                                            {fullRules.guidelines.map((rule, index) => {
                                                const Icon = rule.icon;
                                                return (
                                                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                                                    {rule.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                                    {rule.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* B. Quy tắc bắt buộc */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
                                            B. QUY TẮC BẮT BUỘC
                                        </h3>
                                        <div className="space-y-4">
                                            {fullRules.mandatory.map((rule, index) => {
                                                const Icon = rule.icon;
                                                return (
                                                    <div key={index} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <Icon className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                                                                    {rule.title}
                                                                </h4>
                                                                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                                                                    {rule.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* C. Biện pháp xử lý */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                            <Scale className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-2" />
                                            C. BIỆN PHÁP XỬ LÝ
                                        </h3>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3 font-medium">
                                                Tùy theo mức độ vi phạm, EmoEase có thể áp dụng các biện pháp sau:
                                            </p>
                                            <ul className="space-y-2">
                                                {fullRules.measures.map((measure, index) => (
                                                    <li key={index} className="text-sm text-orange-700 dark:text-orange-300 flex items-start">
                                                        <span className="text-orange-500 mr-2">•</span>
                                                        {measure}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* D. Triết lý thi hành */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                                            D. TRIẾT LÝ THI HÀNH
                                        </h3>
                                        <div className="space-y-4">
                                            {fullRules.philosophy.map((item, index) => (
                                                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityRulesPage;