import React from "react";

export default function LineChart({ seriesA, seriesB, labels }) {
  const width = 600;
  const height = 140;
  const max = Math.max(...seriesA, ...seriesB);
  const stepX = width / (labels.length - 1);

  function toPoints(series) {
    return series
      .map((val, i) => `${i * stepX},${height - (val / max) * height}`)
      .join(" ");
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36" preserveAspectRatio="none">
      <polyline points={toPoints(seriesB)} fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
      <polyline points={toPoints(seriesA)} fill="none" stroke="#1652F0" strokeWidth="2.5" />
    </svg>
  );
}
