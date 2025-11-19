import React from "react";
import { ColourfulText } from "@/components/molecules";

const defaultMembers = [
  {
    name: "Ngọc Diệp",
    role: "Researcher",
    img: "/image/aboutUs/NgocDiep.webp",
    color: "#60a5fa",
  },
  {
    name: "Trường Giang",
    role: "Frontend Developer & UI/UX Designer",
    img: "/image/aboutUs/TruongGiang.webp",
    color: "#f9a8d4",
  },
  {
    name: "Cảnh Tân",
    role: "Backend Engineer",
    img: "/image/aboutUs/CanhTan.webp",
    color: "#34d399",
  },
  {
    name: "Như Tài",
    role: "Frontend Developer",
    img: "/image/aboutUs/NhuTai.webp",
    color: "#34d399",
  },
  {
    name: "Nhật Anh",
    role: "Backend Engineer",
    img: "/image/aboutUs/NhatAnh.webp",
    color: "#34d399",
  },
  {
    name: "Quỳnh Quỳnh",
    role: "Business Lead",
    img: "/image/aboutUs/QuynhQuynh.webp",
    color: "#fde047",
  },
];

function TeamMember({ members = defaultMembers }) {
  return (
    <section className="w-full mx-auto max-w-7xl px-4 pb-16 md:pb-24">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Đằng sau sản phẩm là những con người tận tâm
        </h2>
        <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
          Chúng mình là những sinh viên Gen Z đến từ{" "}
          <ColourfulText text="Đại" /> <ColourfulText text="Học" />{" "}
          <ColourfulText text="FPT" />. Không phải chuyên gia cũng không có
          nhiều kinh nghiệm, nhưng chúng mình thấu hiểu những áp lực và cảm xúc
          mà thế hệ trẻ đang đối diện. Từ sự đồng cảm và đam mê, EmoEase được
          tạo ra với mong muốn góp phần nâng cao ý thức chăm sóc tinh thần, mang
          đến một góc nhỏ an toàn, nơi cảm xúc luôn được lắng nghe và trân
          trọng.
        </p>
      </div>

      {/* MARQUEE SECTION */}
      <div className="relative mt-14 w-full overflow-hidden">
        {/* Track */}
        <div className="marquee flex gap-6 md:gap-8">
          {[...members, ...members].map((m, idx) => (
            <div
              key={m.name + idx}
              className="relative w-[260px] md:w-[300px] shrink-0 rounded-3xl overflow-hidden bg-white">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              <div className="px-5 py-4 bg-white/90 backdrop-blur">
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
                  {m.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1 truncate">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamMember;
