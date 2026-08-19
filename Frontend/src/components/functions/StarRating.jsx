import { Star } from "lucide-react";

export default function StarRating({ rating }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={18} className="text-brand" fill={i < rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}
