import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Tag, AlertCircle } from "lucide-react";
import axios from "axios";
import tokenManager from "@/services/tokenManager";
import LuxuryBtn from "@/components/atoms/Button/LuxuryBtn";
import ToastNotification from "@/components/atoms/Notification/ToastNotification";
import { useNotification } from "@/hooks/useNotification";
const FEATURES = [
  {
    id: "aichat",
    title: "Emo AI – Chatbot cảm xúc",
    free: "Trò chuyện cùng Emo trong 7 ngày",
    premium:
      "Emo đồng hành trọn đời, thấu hiểu bạn hơn và cá nhân hoá trải nghiệm cảm xúc",
  },
  {
    id: "community",
    title: "Cộng đồng ẩn danh",
    free: "Đăng bài, bình luận, chia sẻ cảm xúc cùng mọi người",
    premium: "Đầy đủ tính năng cộng đồng, ưu tiên hiển thị & tương tác",
  },
  {
    id: "moodTracking",
    title: "Theo dõi tâm trạng",
    free: "Báo cáo tâm trạng cơ bản mỗi ngày",
    premium: "Phân tích AI hằng tuần, báo cáo chuyên sâu theo ngày",
  },
  {
    id: "emogifts",
    title: "Quà tặng từ Emo ",
    free: "Tạo tối đa 3 quà tặng/tuần",
    premium: "Lên đến 30 quà tặng/tháng, ưu tiên xử lý nhanh hơn",
  },
  {
    id: "mood",
    title: "Tài sản ảo",
    free: "Truy cập gói cơ bản & gift mặc định",
    premium: "Toàn bộ tài sản ảo: emoji, gift cảm xúc & nội dung độc quyền",
  },
  {
    id: "session",
    title: "Số phiên trò chuyện AI hàng ngày",
    free: "1 phiên/ngày",
    premium: "Không giới hạn, trò chuyện bất cứ lúc nào",
  },
];

const Packages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [packages, setPackages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [purchasedPackageId, setPurchasedPackageId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoPricing, setPromoPricing] = useState(null);
  const [promoFeedback, setPromoFeedback] = useState(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const { notification, showNotification, hideNotification } =
    useNotification();
  // Fetch gói Premium và check purchase status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch packages - không cần Authorization
        const res = await axios.get(
          "https://api.emoease.vn/subscription-service/v2/service-packages?PageIndex=1&PageSize=10"
        );
        setPackages(res.data.servicePackages.data);
        // 2. Nếu user đã đăng nhập thì gọi lại API packages với Authorization
        // API mới sẽ trả về trường `purchaseStatus` cho từng package.
        const token = tokenManager.getCurrentToken();
        if (token) {
          try {
            const authRes = await axios.get(
              "https://api.emoease.vn/subscription-service/v2/service-packages?PageIndex=1&PageSize=10",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const authPackages = authRes.data?.servicePackages?.data || [];
            // Nếu có bất kỳ package nào có purchaseStatus === 'Purchased'
            const purchased = authPackages.find(
              (p) => p.purchaseStatus === "Purchased"
            );
            if (purchased) {
              setPurchasedPackageId(purchased.id);
              setSelectedId(purchased.id);
              // Update packages to the auth-aware response so UI can show purchaseStatus if needed
              setPackages(authPackages);
            }
          } catch (authErr) {
            console.error("Lỗi khi kiểm tra trạng thái mua (auth):", authErr);
            // Không cần hiển thị lỗi cho user ở đây; chỉ log để debug
          }
        }
      } catch (err) {
        console.error("Lỗi tải gói:", err);
        showNotification("error", "Không thể tải thông tin gói dịch vụ.");
      }
    };
    fetchData();
  }, []);

  // Reset promo code khi selectedId thay đổi
  useEffect(() => {
    setPromoCode("");
    setPromoPricing(null);
    setPromoFeedback(null);
  }, [selectedId]);

  // Kiểm tra mã promo code
  const checkPromoCode = async () => {
    if (!promoCode.trim()) {
      showNotification("warning", "Vui lòng nhập mã giảm giá!");
      setPromoFeedback({
        type: "warning",
        message: "Vui lòng nhập mã giảm giá trước khi áp dụng.",
      });
      return;
    }

    if (!selectedId) {
      showNotification("warning", "Vui lòng chọn gói dịch vụ trước!");
      setPromoFeedback({
        type: "warning",
        message: "Hãy chọn gói dịch vụ để áp dụng mã giảm giá.",
      });
      return;
    }

    setIsCheckingPromo(true);
    try {
      const token = tokenManager.getCurrentToken();
      const res = await axios.post(
        "https://api.emoease.vn/subscription-service/v2/user-subscription/pricing",
        {
          servicePackageId: selectedId,
          promoCode: promoCode.trim().toUpperCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = res.data?.response;
      if (response) {
        if (response.status === "Áp dụng thành công") {
          setPromoPricing(response);
          showNotification("success", "Mã giảm giá hợp lệ! 🎉");
          setPromoFeedback({
            type: "success",
            message: "Mã giảm giá hợp lệ! Ưu đãi đã được áp dụng.",
          });
        } else {
          setPromoPricing(null);
          showNotification(
            "error",
            response.status || "Mã giảm giá không hợp lệ"
          );
          setPromoFeedback({
            type: "error",
            message: response.status || "Mã giảm giá không hợp lệ.",
          });
        }
      } else {
        setPromoPricing(null);
        showNotification("error", "Không thể kiểm tra mã giảm giá");
        setPromoFeedback({
          type: "error",
          message: "Không thể kiểm tra mã giảm giá. Vui lòng thử lại.",
        });
      }
    } catch (err) {
      console.error("Lỗi kiểm tra promo code:", err);
      setPromoPricing(null);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.response?.status ||
        "Mã giảm giá không hợp lệ hoặc đã hết hạn";
      showNotification("error", errorMessage);
      setPromoFeedback({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsCheckingPromo(false);
    }
  };

  // Gọi API mua gói
  const handleSubscribe = async () => {
    // Check token trong localStorage
    const token = tokenManager.getCurrentToken();
    if (!token) {
      showNotification("warning", "Vui lòng đăng nhập để tiếp tục!");
      setTimeout(() => {
        navigate("/login", {
          state: { from: location.pathname, section: "#packages-section" },
        });
      }, 1500);
      return;
    }

    if (!selectedId) {
      showNotification("warning", "Vui lòng chọn gói trước khi bắt đầu!");
      return;
    }

    // Check xem user đã mua gói này chưa
    if (purchasedPackageId === selectedId) {
      showNotification("info", "Bạn đã sở hữu gói này rồi!");
      return;
    }

    try {
      // Sử dụng promoCode nếu đã validate thành công
      const validPromoCode =
        promoPricing?.status === "Áp dụng thành công"
          ? promoCode.trim().toUpperCase()
          : null;

      const payload = {
        servicePackageId: selectedId,
        promoCode: validPromoCode,
        giftId: null,
        startDate: new Date().toISOString(),
        paymentMethodName: "PayOS",
        returnUrl: "/payments/callback",
      };

      const res = await axios.post(
        "https://api.emoease.vn/subscription-service/v2/user-subscription",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { paymentUrl } = res.data;

      if (paymentUrl) {
        // ✅ Điều hướng sang trang thanh toán PayOS
        window.location.href = paymentUrl;
      } else {
        showNotification("error", "Không tìm thấy link thanh toán!");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      showNotification("error", "Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  return (
    <section className="py-20 px-4 min-h-screen bg-white">
      {/* Notification */}
      <ToastNotification
        notification={notification}
        onClose={hideNotification}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 px-4 sm:px-6 lg:px-8 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center font-bold leading-tight tracking-wide text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
            Bảng so sánh gói dịch vụ EmoEase
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
            Những gói dịch vụ được thiết kế để hỗ trợ sức khoẻ tinh thần — nhẹ
            nhàng, tin cậy và mang năng lượng tích cực. 🌿
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Free Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-300 transition-all duration-300 shadow-md">
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>

            {/* Price */}
            <div className="mb-2">
              <span className="text-4xl font-bold text-gray-900">Miễn phí</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              mãi mãi, không cần thẻ tín dụng
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setSelectedId(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 mb-6">
              Bắt đầu miễn phí
            </button>

            {/* Features List */}
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f.id} className="flex items-start gap-3">
                  <span className="text-purple-600 text-lg shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-sm text-gray-700">{f.free}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium Plan Card - Highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-linear-to-b from-purple-50 to-white border-2 border-purple-500 rounded-2xl p-8 hover:border-purple-600 transition-all duration-300 shadow-lg shadow-purple-200">
            {/* Pattern Background */}
            <div
              className="absolute inset-0 rounded-2xl opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #a855f7 2px, transparent 2px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Content with relative positioning */}
            <div className="relative z-10">
              {/* Title */}
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                Premium
              </h3>

              {/* Price */}
              <div className="mb-2 flex items-baseline gap-3">
                {packages.length > 0 && packages[0] && (
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      {packages[0].price.toLocaleString("vi-VN")}đ
                    </span>
                    {packages[0].originalPrice > packages[0].price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {packages[0].originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="bg-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                          Giảm 70%
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-8">
                {packages.length > 0 &&
                packages[0].originalPrice > packages[0].price
                  ? `Giá gốc ${packages[0].originalPrice.toLocaleString(
                      "vi-VN"
                    )}đ/tháng, thanh toán hàng tháng`
                  : `thanh toán hàng tháng`}
              </p>

              {/* Features List */}
              <ul className="space-y-3">
                {FEATURES.map((f) => (
                  <li key={f.id} className="flex items-start gap-3">
                    <span className="text-purple-600 text-lg shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {f.premium}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Package Selection & Purchase Section */}
        <div className="mt-16 flex flex-col items-center justify-center p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chọn gói dịch vụ
          </h2>
          <div className="w-full max-w-md space-y-4">
            {packages.map((pkg) => {
              const isSelected = selectedId === pkg.id;
              const isPurchased = purchasedPackageId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => !isPurchased && setSelectedId(pkg.id)}
                  className={`relative rounded-lg border-2 p-4 shadow-sm transition-all duration-200 
              ${
                isPurchased
                  ? "border-green-500 bg-green-50 shadow-lg shadow-green-200 scale-[1.02]"
                  : isSelected
                  ? "border-purple-500 bg-white shadow-lg shadow-purple-200 scale-[1.02] cursor-pointer"
                  : "border-gray-200 bg-white hover:border-purple-300 cursor-pointer"
              }`}>
                  {isPurchased && (
                    <span className="absolute -top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Đã mua
                    </span>
                  )}
                  {pkg.discountLabel && !isPurchased && (
                    <span className="absolute -top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
                      {pkg.discountLabel}
                    </span>
                  )}
                  <div className="text-lg font-semibold text-gray-900">
                    {pkg.price.toLocaleString("vi-VN")}đ cho {pkg.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {pkg.originalPrice > pkg.price
                      ? `Giá gốc ${pkg.originalPrice.toLocaleString(
                          "vi-VN"
                        )}đ cho ${pkg.name}`
                      : `Gói cơ bản`}
                  </div>
                </div>
              );
            })}
            {/* Promo Code Input Section */}
            {!purchasedPackageId && selectedId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md mt-6 p-5 bg-linear-to-br from-purple-50 to-white border-2 border-purple-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mã giảm giá
                  </h3>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      // Reset pricing khi user thay đổi code
                      if (promoPricing) setPromoPricing(null);
                      if (promoFeedback) setPromoFeedback(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isCheckingPromo) {
                        checkPromoCode();
                      }
                    }}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all"
                    disabled={isCheckingPromo}
                  />
                  <button
                    onClick={checkPromoCode}
                    disabled={isCheckingPromo || !promoCode.trim()}
                    className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2">
                    {isCheckingPromo ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">
                          Đang kiểm tra...
                        </span>
                      </>
                    ) : (
                      "Áp dụng"
                    )}
                  </button>
                </div>

                {/* Promo Pricing Info */}
                {promoPricing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    {promoPricing.status === "Áp dụng thành công" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>{promoPricing.status}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Giá gốc:</span>
                            <span className="text-gray-900 line-through">
                              {promoPricing.originalPrice.toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Giảm giá:</span>
                            <span className="text-green-600 font-semibold">
                              -
                              {promoPricing.discountAmount.toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-green-200">
                            <span className="text-gray-900 font-semibold">
                              Thành tiền:
                            </span>
                            <span className="text-green-700 font-bold text-lg">
                              {promoPricing.finalPrice.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700">
                        <XCircle className="h-5 w-5" />
                        <span className="font-medium">
                          {promoPricing.status}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Clear promo button */}
                {promoCode && (
                  <button
                    onClick={() => {
                      setPromoCode("");
                      setPromoPricing(null);
                      setPromoFeedback(null);
                    }}
                    className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline">
                    Xóa mã
                  </button>
                )}

                {promoFeedback && (
                  <div
                    role="status"
                    className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                      promoFeedback.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : promoFeedback.type === "warning"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                    {promoFeedback.type === "success" && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {promoFeedback.type === "warning" && (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {promoFeedback.type === "error" && (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span>{promoFeedback.message}</span>
                  </div>
                )}
              </motion.div>
            )}

            {!purchasedPackageId && (
              <LuxuryBtn
                text="Mua gói"
                onClick={handleSubscribe}
                variant="responsive"
              />
            )}
            {purchasedPackageId && (
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-semibold">
                  Bạn đã sở hữu gói Premium!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
