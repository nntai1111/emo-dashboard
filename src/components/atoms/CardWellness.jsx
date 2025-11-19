import React, { memo, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const Card = memo(
  forwardRef(({ item, isActive, circumference, setActiveId }, ref) => {
    const navigate = useNavigate();

    const handleClick = () => {
      if (isActive) {
        // If already active, navigate to challenge task timeline with challenge ID
        navigate(`/space/challenge?view=task&challengeId=${item.id}`);
      } else {
        // If not active, set as active
        setActiveId(item.id);
      }
    };

    return (
      <div
        ref={ref}
        style={{
          backgroundImage: `url(${item.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "200px"
        }}
        className={`relative bg-purple-100 border border-orange-500 rounded-3xl p-4 flex flex-col justify-between snap-center transition-all duration-300 ${isActive ? "scale-100 z-20 opacity-100 w-full brightness-100" : "scale-90 z-10 w-11/12 -mb-20 brightness-75  cursor-pointer"
          }`}
        onClick={handleClick}
      >
        <div className="relative z-10">
          <h3
            className="text-lg font-semibold text-black mb-2 
             bg-white/50 backdrop-blur-sm px-2 py-1 rounded"
          >
            {item.title}
          </h3>
          <p className="text-sm text-gray-900 drop-shadow-md mb-2">{item.places}</p>

          {/* Challenge Type, Start Date, Process Status */}
          <div className="flex flex-wrap gap-2 mb-2">

            {item.startDate && (
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full text-xs font-medium shadow-sm">
                {new Date(item.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            )}
            {item.processStatus && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm ${item.processStatus === 'Completed' ? 'bg-white/90 text-green-700' :
                item.processStatus === 'Progressing' ? 'bg-white/90 text-yellow-700' :
                  'bg-white/90 text-gray-700'
                }`}>
                {item.processStatus === 'Completed' ? 'Hoàn thành' :
                  item.processStatus === 'Progressing' ? 'Đang làm' :
                    item.processStatus === 'NotStarted' ? 'Chưa bắt đầu' :
                      item.processStatus}
              </span>
            )}
          </div>
        </div>

        {/* Percent ở góc dưới phải */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="relative w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-300"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                className="text-blue-500"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - item.percent / 100)}
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
              {item.percent}%
            </span>
          </div>
        </div>
      </div>
    );
  })
);

export default Card;