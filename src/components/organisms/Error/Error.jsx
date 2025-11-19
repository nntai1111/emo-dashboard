import React from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Error = () => {
  return (
    <main
      className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6"
      aria-labelledby="error-title"
      role="main">
      <section className="w-full max-w-5xl flex flex-col items-center text-center gap-6">
        <div className="w-full flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/038e1e02-ef0a-466b-8058-68b6e9ac9d14/RvBQLmr0d9.lottie"
            loop
            autoplay
            style={{
              width: "clamp(220px, 60vw, 520px)",
              height: "auto",
              aspectRatio: "1 / 1",
            }}
            aria-label="404 - Page not found animation"
          />
        </div>

        <h1
          id="error-title"
          className="font-extrabold tracking-tight text-neutral-900 text-[clamp(20px,5vw,36px)]">
          Oops! Không tìm thấy trang
        </h1>
        <p className="max-w-prose text-neutral-600 text-[clamp(14px,3.2vw,16px)]">
          Có thể đường dẫn đã thay đổi hoặc trang tạm thời không khả dụng. Hãy
          quay lại trang chủ để tiếp tục.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-[clamp(14px,3.2vw,16px)] hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            aria-label="Về trang chủ">
            Về trang chủ
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Error;
