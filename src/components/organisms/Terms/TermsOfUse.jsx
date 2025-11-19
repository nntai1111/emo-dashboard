import React from "react";

import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const TermsOfUse = () => {
  return (
    <>
      {/* Content */}
      <section className="relative z-[30] w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-slate-100">
          <header className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              Điều khoản sử dụng EmoEase
            </h2>
          </header>

          <div className="space-y-6 sm:space-y-8">
            <section>
              <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3">
                1. Chấp nhận điều khoản
              </h3>
              <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] mb-2 text-white/90">
                Khi đăng ký tài khoản và sử dụng ứng dụng EmoEase, bạn đồng ý
                chấp nhận và tuân thủ toàn bộ điều khoản này.
              </p>
              <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] text-white/90">
                Mọi hành vi công kích, sử dụng ngôn từ tiêu cực hoặc gây tổn hại
                cho người khác trong không gian ứng dụng và trên các kênh cộng
                đồng liên quan đến EmoEase đều bị nghiêm cấm.
              </p>
            </section>

            <section>
              <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3">
                2. Nội dung và mục đích sử dụng
              </h3>
              <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] mb-2 text-white/90">
                EmoEase là nền tảng hỗ trợ sức khỏe tinh thần, trong đó AI
                chatbot không thay thế cho tư vấn y tế hay trị liệu tâm lý
                chuyên nghiệp.
              </p>
              <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] text-white/90">
                Tất cả nội dung, công cụ và tính năng trong ứng dụng chỉ mang
                tính chất hỗ trợ, gợi ý và đồng hành, không đưa ra chẩn đoán hay
                chỉ định y tế.
              </p>
            </section>

            <section>
              <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3">
                3. Quyền và trách nhiệm của người dùng
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[15px] sm:text-[17px] leading-7 sm:leading-8 text-white/90">
                <li>
                  Không đăng tải hoặc chia sẻ nội dung vi phạm pháp luật, mang
                  tính bạo lực, phân biệt đối xử hoặc có thể gây hại cho người
                  khác.
                </li>
                <li>
                  Không sử dụng ngôn từ hay hành vi mang tính khuyến khích, kích
                  động các hành động tiêu cực.
                </li>
                <li>
                  Chịu trách nhiệm về mọi thông tin, hành vi và quyết định cá
                  nhân khi sử dụng ứng dụng.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3">
                4. Quyền và trách nhiệm của EmoEase
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-[15px] sm:text-[17px] leading-7 sm:leading-8 text-white/90">
                <li>
                  Đảm bảo cung cấp dịch vụ an toàn, bảo mật và liên tục trong
                  phạm vi khả năng.
                </li>
                <li>
                  Có quyền thay đổi, nâng cấp hoặc tạm ngừng tính năng mà không
                  cần thông báo trước.
                </li>
                <li>
                  Không chịu trách nhiệm với bất kỳ thiệt hại trực tiếp hoặc
                  gián tiếp nào phát sinh từ việc người dùng sử dụng ứng dụng
                  sai mục đích.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg sm:text-2xl font-semibold text-white mb-3">
                5. Bảo mật và quyền riêng tư
              </h3>
              <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] mb-2 text-white/90">
                EmoEase cam kết bảo vệ thông tin cá nhân và dữ liệu người dùng
                theo Chính sách Bảo mật.
              </p>
              <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] text-white/90">
                Mọi thông tin được chia sẻ trong ứng dụng sẽ được ẩn danh và
                không tiết lộ cho bên thứ ba nếu chưa có sự đồng ý từ người
                dùng, ngoại trừ các trường hợp bắt buộc theo quy định pháp luật.
              </p>
            </section>
          </div>
          {/* Callout link to Privacy Policy */}
          <div className="mt-8 sm:mt-12">
            <div className="rounded-2xl bg-gradient-to-r from-purple-300/30 via-white/20 to-pink-300/30 p-[1px] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
              <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-white text-sm sm:text-lg font-semibold truncate">
                    Chính sách Quyền riêng tư
                  </h4>
                  <p className="text-white/80 text-xs sm:text-base leading-6">
                    Tìm hiểu cách chúng tôi bảo vệ dữ liệu của bạn.
                  </p>
                </div>
                <Link
                  to="/terms/privacy"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-purple-600/90 text-white text-sm sm:text-base font-semibold px-3 sm:px-5 py-2 shadow-md hover:shadow-lg hover:bg-purple-600 transition-all duration-200"
                  aria-label="Xem Chính sách Quyền riêng tư"
                  onClick={() => {
                    try {
                      window.scrollTo({ top: 0, behavior: "instant" });
                    } catch {
                      window.scrollTo(0, 0);
                    }
                  }}>
                  Xem chi tiết
                  <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfUse;
