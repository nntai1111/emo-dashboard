import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const Privacy = () => {
  return (
    <>
      {/* Content */}
      <section className="relative z-[30] w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-slate-100">
          <header className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              Chính sách Quyền riêng tư của EmoEase
            </h2>
            <p className="mt-2 text-xs sm:text-base text-white/70">
              Lần sửa đổi cuối: 05 tháng 10, 2025
            </p>
          </header>

          <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] mb-4 text-white/90">
            Tại EmoEase, sự tôn trọng quyền riêng tư của bạn là nền tảng cho mọi
            hoạt động của chúng tôi. Kể từ khi bắt đầu, đội ngũ phát triển
            SolTech đã luôn nỗ lực xây dựng Dịch vụ dựa trên những nguyên tắc
            bảo mật vững chắc nhất.
          </p>
          <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] mb-4 text-white/90">
            Chính sách Quyền riêng tư này mô tả cách EmoEase thu thập, sử dụng
            và tiết lộ thông tin, cũng như những lựa chọn bạn có đối với thông
            tin của mình. Chúng tôi cam kết bảo vệ và tôn trọng quyền riêng tư
            của bạn. Chúng tôi khuyến khích bạn đọc kỹ chính sách này và liên hệ
            với chúng tôi nếu có bất kỳ câu hỏi nào.
          </p>
          <p className="leading-7 sm:leading-8 text-[15px] sm:text-[17px] mb-6 text-white/90">
            Khi chúng tôi đề cập đến “EmoEase”, “chúng tôi”, “của chúng tôi”,
            chúng tôi muốn nói đến Nhóm SolTech và các cộng sự, đơn vị chịu
            trách nhiệm kiểm soát và xử lý thông tin của bạn. Chính sách này nêu
            rõ cách chúng tôi xử lý mọi dữ liệu cá nhân mà chúng tôi thu thập từ
            bạn hoặc do bạn cung cấp. Vui lòng đọc kỹ để hiểu rõ các thông lệ
            của chúng tôi liên quan đến dữ liệu cá nhân của bạn.
          </p>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 sm:my-8" />

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Thông tin Chúng tôi Thu thập và Tiếp nhận
            </h3>
            <p className="mb-4">
              EmoEase cần thu thập một số thông tin nhất định để vận hành, cung
              cấp, cải thiện, tùy chỉnh và hỗ trợ Dịch vụ. Các loại thông tin
              chúng tôi thu thập phụ thuộc vào cách bạn sử dụng Dịch vụ của
              chúng tôi.
            </p>
            <p className="mb-4">
              Chúng tôi có thể thu thập và xử lý các dữ liệu sau:
            </p>
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <p className="font-medium mb-1">Thông tin bạn cung cấp:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">
                      Thông tin đăng ký tài khoản:
                    </span>{" "}
                    Khi bạn tạo tài khoản, bạn có thể cung cấp các thông tin như
                    tên người dùng, địa chỉ email, mật khẩu, và ngày sinh. Việc
                    đăng nhập thông qua các nền tảng thứ ba như Google cũng có
                    thể cung cấp cho chúng tôi thông tin định danh tài khoản của
                    bạn.
                  </li>
                  <li>
                    <span className="font-medium">
                      Nội dung cuộc trò chuyện của bạn:
                    </span>{" "}
                    Chúng tôi thu thập và xử lý nội dung các tin nhắn bạn gửi
                    cho EmoEase để chatbot có thể hiểu và phản hồi lại bạn. Các
                    cuộc trò chuyện này được mã hóa khi truyền tải và lưu trữ.
                    Chúng tôi không chủ động xem xét nội dung trò chuyện trừ khi
                    bạn báo cáo một vấn đề cụ thể hoặc vì lý do an toàn được nêu
                    rõ bên dưới.
                  </li>
                  <li>
                    <span className="font-medium">
                      Thông tin Hỗ trợ Khách hàng:
                    </span>{" "}
                    Khi bạn liên hệ với chúng tôi để được hỗ trợ, bạn có thể
                    cung cấp thông tin liên quan đến việc sử dụng Dịch vụ, ví dụ
                    như nội dung trao đổi, thông tin về lỗi ứng dụng. Chúng tôi
                    có thể lưu lại bản ghi của các cuộc trao đổi này.
                  </li>
                  <li>
                    <span className="font-medium">
                      Thông tin từ các cuộc khảo sát:
                    </span>{" "}
                    Nếu bạn tham gia các cuộc khảo sát hoặc thăm dò ý kiến,
                    chúng tôi sẽ thu thập thông tin bạn cung cấp. Bạn không bắt
                    buộc phải tham gia các hoạt động này.
                  </li>
                </ul>
              </li>
              <li>
                <p className="font-medium mb-1">Thông tin thu thập tự động:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">
                      Thông tin Sử dụng và Nhật ký (Log):
                    </span>{" "}
                    Chúng tôi thu thập thông tin về hoạt động của bạn trên Dịch
                    vụ, bao gồm thông tin chẩn đoán, hiệu suất và dịch vụ. Điều
                    này bao gồm: cách bạn tương tác với chatbot, thời gian, tần
                    suất và thời lượng các hoạt động của bạn, báo cáo sự cố và
                    hiệu suất.
                  </li>
                  <li>
                    <span className="font-medium">
                      Thông tin Thiết bị và Kết nối:
                    </span>{" "}
                    Khi bạn cài đặt, truy cập hoặc sử dụng Dịch vụ, chúng tôi sẽ
                    thu thập thông tin về thiết bị của bạn. Điều này bao gồm:
                    loại thiết bị di động, mã định danh thiết bị duy nhất, thông
                    tin mạng di động, hệ điều hành, phiên bản ứng dụng, và địa
                    chỉ IP.
                  </li>
                  <li>
                    <span className="font-medium">Địa chỉ IP và Cookies:</span>{" "}
                    Chúng tôi có thể sử dụng địa chỉ IP để xác định vị trí địa
                    lý tổng quan của bạn nhằm cung cấp nội dung phù hợp hơn.
                    Giống như nhiều dịch vụ trực tuyến khác, chúng tôi có thể sử
                    dụng cookies (nếu có phiên bản web) để vận hành, cải thiện
                    trải nghiệm và tùy chỉnh Dịch vụ.
                  </li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Nơi chúng tôi lưu trữ dữ liệu cá nhân của bạn
            </h3>
            <p className="mb-4">
              Chúng tôi có thể sử dụng các nhà cung cấp dịch vụ bên thứ ba (ví
              dụ: Google Cloud, Amazon Web Services) để lưu trữ dữ liệu của bạn.
              Dữ liệu của bạn có thể được chuyển đến và lưu trữ tại các địa điểm
              bên ngoài quốc gia của bạn. Bằng cách gửi dữ liệu cá nhân của
              mình, bạn đồng ý với việc chuyển giao, lưu trữ hoặc xử lý này.
              Chúng tôi sẽ thực hiện mọi bước cần thiết một cách hợp lý để đảm
              bảo rằng dữ liệu của bạn được xử lý an toàn và tuân thủ chính sách
              này.
            </p>
            <p className="mb-0">
              Mọi thông tin bạn cung cấp đều được lưu trữ trên các máy chủ bảo
              mật của chúng tôi. Mặc dù chúng tôi nỗ lực hết sức để bảo vệ dữ
              liệu của bạn, việc truyền tải thông tin qua internet không hoàn
              toàn an toàn tuyệt đối. Mọi quá trình truyền tải đều do bạn tự
              chịu rủi ro. Khi đã nhận được thông tin, chúng tôi sẽ áp dụng các
              quy trình và tính năng bảo mật nghiêm ngặt để ngăn chặn truy cập
              trái phép.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Cách Chúng tôi Sử dụng Thông tin
            </h3>
            <p className="mb-4">
              Chúng tôi sử dụng thông tin thu thập được để vận hành, cung cấp,
              cải thiện, tùy chỉnh, hỗ trợ và quảng bá Dịch vụ của mình. Cụ thể
              như sau:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Cung cấp Dịch vụ:</span> Chúng tôi
                sử dụng thông tin của bạn để vận hành chatbot, cung cấp hỗ trợ
                khách hàng, sửa lỗi và cá nhân hóa trải nghiệm. Chúng tôi phân
                tích cách người dùng sử dụng Dịch vụ để đánh giá, cải tiến,
                nghiên cứu và phát triển các tính năng mới.
              </li>
              <li>
                <span className="font-medium">An toàn và Bảo mật:</span> Chúng
                tôi xác minh tài khoản, giám sát các hoạt động đáng ngờ và thúc
                đẩy an toàn trong và ngoài Dịch vụ. Điều này bao gồm việc điều
                tra các hành vi vi phạm Điều khoản Sử dụng của chúng tôi hoặc
                các hoạt động bất hợp pháp, và đảm bảo Dịch vụ được sử dụng hợp
                pháp.
              </li>
              <li>
                <span className="font-medium">Trường hợp khẩn cấp:</span> Thông
                tin bạn chia sẻ có thể được chuyển cho các cơ quan chức năng có
                thẩm quyền nếu: (a) pháp luật yêu cầu; (b) chúng tôi có lý do để
                tin rằng có một cá nhân nào đó có nguy cơ gây hại cho bản thân
                hoặc người khác; (c) có trường hợp khẩn cấp cần sự can thiệp để
                bảo vệ an toàn.
              </li>
              <li>
                <span className="font-medium">Nghiên cứu:</span> Chúng tôi có
                thể chia sẻ dữ liệu đã được ẩn danh hoàn toàn (de-identified)
                cho các tổ chức học thuật và cơ quan nghiên cứu cho các mục đích
                liên quan đến sức khỏe tinh thần. Chúng tôi đảm bảo rằng bất kỳ
                dữ liệu nào như vậy đều không thể nhận dạng cá nhân và các bên
                nhận dữ liệu phải tuân thủ các tiêu chuẩn nghiêm ngặt về bảo mật
                và đạo đức.
              </li>
              <li>
                <span className="font-medium">Giao tiếp và Tiếp thị:</span>{" "}
                Thỉnh thoảng, chúng tôi có thể sử dụng email của bạn để gửi bản
                tin nội bộ, thông tin cập nhật về Dịch vụ hoặc các thông tin
                khác mà chúng tôi cho rằng bạn quan tâm. Mọi email sẽ chứa liên
                kết cho phép bạn "Hủy đăng ký" bất kỳ lúc nào.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Thông tin Bạn và Chúng tôi Chia sẻ
            </h3>
            <p className="mb-4">
              Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia
              sẻ thông tin của bạn để vận hành, cung cấp, cải thiện và hỗ trợ
              Dịch vụ.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">
                  Nhà cung cấp Dịch vụ Bên thứ ba:
                </span>{" "}
                Chúng tôi hợp tác với các nhà cung cấp bên thứ ba để giúp chúng
                tôi vận hành và cải thiện Dịch vụ (ví dụ: nhà cung cấp dịch vụ
                lưu trữ đám mây, nhà cung cấp mô hình ngôn ngữ AI, dịch vụ phân
                tích). Các nhà cung cấp này chỉ được phép truy cập thông tin của
                bạn để thực hiện các tác vụ thay mặt chúng tôi và có nghĩa vụ
                không tiết lộ hoặc sử dụng nó cho bất kỳ mục đích nào khác.
              </li>
              <li>
                <span className="font-medium">Chuyển giao quyền sở hữu:</span>{" "}
                Tất cả các quyền và nghĩa vụ của chúng tôi theo Chính sách Quyền
                riêng tư này có thể được chuyển nhượng tự do cho bất kỳ chi
                nhánh nào của chúng tôi, liên quan đến việc sáp nhập, mua lại,
                tái cấu trúc hoặc bán tài sản.
              </li>
              <li>
                <span className="font-medium">Yêu cầu pháp lý:</span> Chúng tôi
                sẽ chia sẻ thông tin của bạn nếu chúng tôi có nghĩa vụ phải làm
                vậy để tuân thủ bất kỳ nghĩa vụ pháp lý nào (bao gồm việc trả
                lời yêu cầu từ cơ quan thực thi pháp luật), hoặc để thực thi
                Điều khoản sử dụng của chúng tôi.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Cơ sở Pháp lý và Quyền của Bạn
            </h3>
            <p className="mb-4">
              Chúng tôi thu thập, sử dụng và chia sẻ thông tin của bạn dựa trên
              các cơ sở sau:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cần thiết để thực hiện Điều khoản Dịch vụ của chúng tôi.</li>
              <li>
                Phù hợp với sự đồng ý của bạn, mà bạn có thể thu hồi bất cứ lúc
                nào.
              </li>
              <li>Cần thiết để tuân thủ các nghĩa vụ pháp lý của chúng tôi.</li>
              <li>
                Cần thiết vì lợi ích hợp pháp của chúng tôi (hoặc của người
                khác), bao gồm lợi ích của chúng tôi trong việc cung cấp một
                dịch vụ đổi mới, an toàn và phù hợp.
              </li>
            </ul>
            <p className="mt-4">
              Theo pháp luật Việt Nam về an ninh mạng và bảo vệ dữ liệu cá nhân,
              bạn có các quyền sau:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <span className="font-medium">
                  Quyền truy cập, cải chính và xóa bỏ thông tin:
                </span>{" "}
                Bạn có thể truy cập, cập nhật và xóa thông tin tài khoản của
                mình thông qua các công cụ trong ứng dụng.
              </li>
              <li>
                <span className="font-medium">
                  Quyền phản đối và hạn chế xử lý:
                </span>{" "}
                Bạn có quyền phản đối việc chúng tôi xử lý thông tin của bạn
                trong một số trường hợp nhất định.
              </li>
              <li>
                Bạn có thể thực hiện các quyền của mình bằng cách liên hệ với
                chúng tôi qua email:{" "}
                <a
                  href="mailto:emoease.vn@gmail.com"
                  className="text-slate-900 underline underline-offset-4">
                  emoease.vn@gmail.com
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Quản lý và Xóa thông tin của bạn
            </h3>
            <p className="mb-4">
              Chúng tôi lưu trữ thông tin cho đến khi không còn cần thiết để
              cung cấp Dịch vụ, hoặc cho đến khi tài khoản của bạn bị xóa, tùy
              điều kiện nào đến trước.
            </p>
            <p className="mb-2">
              <span className="font-medium">Xóa tài khoản của bạn:</span> Bạn có
              thể xóa tài khoản EmoEase của mình bất kỳ lúc nào bằng tính năng
              xóa tài khoản trong ứng dụng. Khi bạn xóa tài khoản, thông tin của
              bạn sẽ được lên lịch để xóa vĩnh viễn khỏi máy chủ của chúng tôi.
              Xin lưu ý rằng việc chỉ gỡ cài đặt ứng dụng khỏi thiết bị sẽ không
              xóa tài khoản của bạn. Chúng tôi cố gắng xóa thông tin của bạn
              trong vòng 30 ngày kể từ ngày yêu cầu. Nếu bạn đăng nhập lại trong
              khoảng thời gian này, yêu cầu xóa sẽ bị hủy.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Chính sách của chúng tôi về Trẻ vị thành niên
            </h3>
            <p>
              EmoEase không dành cho các cá nhân dưới 16 tuổi. Do đó, các cá
              nhân dưới 16 tuổi không được phép tạo tài khoản. Chúng tôi không
              cố ý thu thập thông tin từ trẻ em dưới 16 tuổi. Nếu chúng tôi biết
              rằng bạn dưới 16 tuổi và đang sử dụng Dịch vụ, chúng tôi có thể
              chấm dứt tài khoản người dùng của bạn.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Thay đổi đối với Chính sách Quyền riêng tư của chúng tôi
            </h3>
            <p>
              Chúng tôi có thể cập nhật Chính sách Quyền riêng tư này để phản
              ánh những thay đổi trong thực tiễn và dịch vụ của chúng tôi. Khi
              chúng tôi đăng các thay đổi, chúng tôi sẽ sửa đổi ngày "Lần sửa
              đổi cuối" ở đầu chính sách. Nếu có bất kỳ thay đổi quan trọng nào,
              chúng tôi sẽ thông báo cho bạn bằng cách đăng thông báo nổi bật
              trên Dịch vụ của chúng tôi và/hoặc qua email.
            </p>
          </section>

          <section>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-3">
              Liên hệ
            </h3>
            <p>
              Mọi câu hỏi, bình luận và yêu cầu liên quan đến chính sách quyền
              riêng tư này đều được hoan nghênh và xin gửi về địa chỉ:{" "}
              <a
                href="mailto:emoease.vn@gmail.com"
                className="text-slate-900 underline underline-offset-4">
                emoease.vn@gmail.com
              </a>
            </p>
          </section>
        </div>
        {/* Callout link to Terms of Use */}
        <div className="mt-10 sm:mt-12 ">
          <div className="max-w-3xl mx-auto pb-10">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-300/40 via-white/40 to-indigo-300/40 p-[1px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="rounded-2xl bg-white/90 backdrop-blur px-5 sm:px-6 py-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-slate-900 text-base sm:text-lg font-semibold truncate">
                    Điều khoản sử dụng
                  </h4>
                  <p className="text-slate-600 text-sm sm:text-base leading-6">
                    Xem các quy định và cam kết khi dùng EmoEase.
                  </p>
                </div>
                <Link
                  to="/terms/terms-of-use"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-900 text-white text-sm sm:text-base font-semibold px-4 sm:px-5 py-2 shadow-md hover:shadow-lg hover:bg-slate-800 transition-all duration-200"
                  aria-label="Xem Điều khoản sử dụng"
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

export default Privacy;
