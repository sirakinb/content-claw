import { format } from 'date-fns';
import { Clock, Video, Edit3, Trash2 } from 'lucide-react';
import { CategoryBadge, StatusBadge } from './Badge';
import { PLATFORMS } from '../data/content';

export default function ContentCard({ item, onEdit, onDelete }) {
  const platform = PLATFORMS.find((p) => p.id === item.platform);

  return (
    <div className="group bg-surface-raised rounded-2xl border border-gray-200/60 p-5 hover:shadow-lg hover:border-brand-200 transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge categoryId={item.category} />
          <StatusBadge statusId={item.status} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-ink-muted hover:text-brand-600 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-ink-muted hover:text-coral transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-ink leading-snug mb-2 line-clamp-2">{item.title}</h3>

      {item.hook && (
        <p className="text-xs text-ink-muted leading-relaxed mb-3 line-clamp-2 italic">"{item.hook}"</p>
      )}

      <div className="flex items-center gap-3 text-[11px] text-ink-faint">
        {platform && (
          <span className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            {platform.label}
          </span>
        )}
        {item.scheduledDate && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(item.scheduledDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>
    </div>
  );
}
