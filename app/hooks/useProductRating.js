"use client";

import { useState } from "react";

export function useProductRating(serial, initialRating = 0, initialReviews = 0) {
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [numReviews, setNumReviews] = useState(initialReviews);

  const handleRate = async (rating) => {
    try {
      const res = await fetch(`/api/products/${serial}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentRating(data.rating);
        setNumReviews(data.numReviews);
        return { success: true, data };
      }
      return { success: false, error: data.message };
    } catch (error) {
      console.error("Rating error:", error);
      return { success: false, error: error.message };
    }
  };

  return { currentRating, numReviews, handleRate };
}
