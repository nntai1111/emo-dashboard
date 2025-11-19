// import styles from "../../../../styles/Font/Font.module.css";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <div className="grid grid-cols-1">
//       {/* Hàng 1 - Logo EMOEASE */}
//       <div className="relative h-40 bg-white">
//         <span
//           className={`${styles.holtwood}
//             absolute
//             text-[#4a2580]
//             top-10
//             left-1/2
//             transform
//             -translate-x-1/2
//             font-bold
//             text-[9rem]
//             leading-none
//             `}>
//           EMOEASE
//         </span>
//       </div>

//       {/* Hàng 2 - Footer chính */}
//       <div className="w-full bg-[#4a2580] py-8">
//         {/* Container chính */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Phần trên - Logo, Links, Contact */}
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
//             {/* Logo section */}
//             <div className="flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6 text-white mr-2"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 10V3L4 14h7v7l9-11h-7z"
//                 />
//               </svg>
//               <span className="text-2xl font-bold tracking-wider text-white">
//                 SOLTECH
//               </span>
//             </div>

//             {/* Links section */}
//             <div className="flex gap-8">
//               <a
//                 href="#"
//                 className="text-white hover:text-gray-200 transition-colors">
//                 Terms & Conditions
//               </a>
//               <a
//                 href="#"
//                 className="text-white hover:text-gray-200 transition-colors">
//                 Privacy Policy
//               </a>
//             </div>

//             {/* Contact section */}
//             <div className="flex items-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-white mr-2"
//                 viewBox="0 0 20 20"
//                 fill="currentColor">
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//               <a
//                 href="mailto:Gianggg244@gmail.com"
//                 className="text-white hover:text-gray-200 transition-colors">
//                 Gianggg244@gmail.com
//               </a>
//               <Link
//                 to="addProduct"
//                 className="cursor-pointer duration-200 hover:scale-125 active:scale-100"
//                 title="Attach">
//                 <svg
//                   className="stroke-blue-300 fill-none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20px"
//                   height="20px"
//                   viewBox="0 -0.5 25 25">
//                   <path
//                     strokeLinejoin="round"
//                     strokeLinecap="round"
//                     strokeWidth="1.5"
//                     d="M15.17 11.053L11.18 15.315C10.8416 15.6932 10.3599 15.9119 9.85236 15.9178C9.34487 15.9237 8.85821 15.7162 8.51104 15.346C7.74412 14.5454 7.757 13.2788 8.54004 12.494L13.899 6.763C14.4902 6.10491 15.3315 5.72677 16.2161 5.72163C17.1006 5.71649 17.9463 6.08482 18.545 6.736C19.8222 8.14736 19.8131 10.2995 18.524 11.7L12.842 17.771C12.0334 18.5827 10.9265 19.0261 9.78113 18.9971C8.63575 18.9682 7.55268 18.4695 6.78604 17.618C5.0337 15.6414 5.07705 12.6549 6.88604 10.73L12.253 5"></path>
//                 </svg>
//               </Link>
//             </div>
//           </div>

//           {/* Đường kẻ ngang */}
//           <hr className="border-t border-purple-400/30 my-4" />

//           {/* Phần dưới - Social icons và Copyright */}
//           <div className="pt-4 flex flex-col items-center">
//             {/* Copyright */}
//             <p className="text-white text-center">
//               © {new Date().getFullYear()} SOLTECH. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/image/footer/img_Footer.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 10%",
        backgroundRepeat: "no-repeat",
      }}
      className="flex max-w-full items-center justify-center relative">

      {/* <div className="w-full px-4 sm:px-6 lg:px-8 pb-2 absolute bottom-0">
        <div className="mx-auto max-w-7xl rounded-2xl bg-black/35 backdrop-blur-sm ring-1 ring-white/10 shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
    
            <div>
              <div className="flex items-center gap-2 text-white">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="opacity-90">
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-bold text-xl tracking-wide">EmoEase</span>
              </div>
              <p className="mt-4 text-sm text-white/80 leading-relaxed">
                EmoEase là người bạn đồng hành chăm sóc cảm xúc của bạn. Khám
                phá, theo dõi và cải thiện sức khỏe tinh thần mỗi ngày với giao
                diện nhẹ nhàng và trực quan.
              </p>
              <div
                className="mt-5 flex items-center gap-3"
                aria-label="Social links">
                <a
                  href="#"
                  className="text-white/80 hover:text-violet-300 transition-colors"
                  aria-label="Follow on Twitter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path d="M8.29 20c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.54A8.35 8.35 0 0022 5.92a8.19 8.19 0 01-2.36.65 4.12 4.12 0 001.81-2.27 8.22 8.22 0 01-2.61 1 4.11 4.11 0 00-7 3.75 11.68 11.68 0 01-8.48-4.3 4.1 4.1 0 001.27 5.49 4.07 4.07 0 01-1.86-.51v.05a4.11 4.11 0 003.3 4.03 4.14 4.14 0 01-1.85.07 4.11 4.11 0 003.84 2.85A8.25 8.25 0 012 18.58 11.64 11.64 0 008.29 20z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-violet-300 transition-colors"
                  aria-label="Follow on Facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.86c0-2.5 1.5-3.88 3.79-3.88 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-violet-300 transition-colors"
                  aria-label="Connect on LinkedIn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path d="M4.98 3.5C4.98 4.6 4.1 5.5 3 5.5S1.02 4.6 1.02 3.5 1.9 1.5 3 1.5s1.98.9 1.98 2zM.5 8.5h5v14h-5v-14zM8.5 8.5h4.8v1.9h.1c.7-1.2 2.4-2.5 4.9-2.5 5.2 0 6.2 3.4 6.2 7.8v8.8h-5v-7.8c0-1.9 0-4.3-2.6-4.3s-3 2-3 4.1v8h-5v-14z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-violet-300 transition-colors"
                  aria-label="View on GitHub">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.46-1.18-1.12-1.49-1.12-1.49-.92-.64.07-.63.07-.63 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.37 1.1 2.95.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.62 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.36.21 2.37.11 2.62.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.67.92.67 1.85 0 1.34-.01 2.41-.01 2.73 0 .27.18.58.69.48A10 10 0 0012 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

      
            <div>
              <h3 className="text-white font-semibold tracking-wide uppercase text-sm">
                Sản phẩm
              </h3>
              <ul className="mt-4 space-y-2 text-white/85 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Tính năng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Bảng giá
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Tài liệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Câu hỏi thường gặp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold tracking-wide uppercase text-sm">
                Công ty
              </h3>
              <ul className="mt-4 space-y-2 text-white/85 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

          
            <div>
              <h3 className="text-white font-semibold tracking-wide uppercase text-sm">
                Hỗ trợ
              </h3>
              <ul className="mt-4 space-y-2 text-white/85 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Trung tâm hỗ trợ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-violet-300 transition-colors">
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>

              <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
                <label
                  htmlFor="newsletter"
                  className="text-white/90 text-sm font-medium">
                  Đăng ký nhận tin
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="newsletter"
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-violet-300 focus:outline-none px-3 py-2 text-sm"
                    aria-label="Email"
                  />
                  <button class="inline-block py-2 px-3 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
 
          <div className="mt-5 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/80">
            <p>© {new Date().getFullYear()} EmoEase. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-violet-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-violet-300 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-violet-300 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Footer;


