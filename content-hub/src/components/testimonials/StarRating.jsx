import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 'md', readonly = false }) {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-all duration-150 ${readonly ? '' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
        >
          <Star
            className={`${dim} transition-colors ${
              star <= value
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                : 'text-white/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
