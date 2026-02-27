import { CATEGORIES, STATUSES } from '../data/content';

export function CategoryBadge({ categoryId }) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${cat.color}`}>
      {cat.label}
    </span>
  );
}

export function StatusBadge({ statusId }) {
  const st = STATUSES.find((s) => s.id === statusId);
  if (!st) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${st.color}`}>
      {st.label}
    </span>
  );
}
