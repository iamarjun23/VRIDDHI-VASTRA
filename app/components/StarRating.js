"use client";

import { useState } from "react";

export default function StarRating({ rating = 0, numReviews = 0, onRate, interactive = false }) {
  const [hover, setHover] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div className="flex">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}`}
              onMouseEnter={() => interactive && setHover(star)}
              onMouseLeave={() => interactive && setHover(0)}
              onClick={() => interactive && onRate && onRate(star)}
            >
              <svg
                className={`w-7 h-7 ${(hover || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-transparent"
                  } ${interactive && hover >= star ? "text-yellow-300 fill-yellow-300" : ""}`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        {numReviews > 0 && (
          <span className="text-xs text-gray-500 font-medium ml-2">
            ({rating.toFixed(1)}) {numReviews} {numReviews === 1 ? 'review' : 'reviews'}
          </span>
        )}
        {interactive && !numReviews && (
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold ml-2">
            Be the first to rate
          </span>
        )}
      </div>
    </div>
  );
}
