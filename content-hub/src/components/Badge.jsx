import { CATEGORIES, STATUSES } from '../data/content';

const catColors = {
  'ai-tools': 'bg-brand-500/20 text-brand-300',
  'business': 'bg-amber/20 text-amber',
  'business-strategy': 'bg-coral/20 text-coral',
  'technical': 'bg-sky/20 text-sky',
  'deep-dives': 'bg-emerald/20 text-emerald',
  'vcp': 'bg-brand-700/20 text-brand-300',
};

const statusColors = {
  'draft': 'bg-white/[0.06] text-white/50',
  'scheduled': 'bg-brand-500/15 text-brand-300',
  'published': 'bg-emerald/15 text-emerald',
};

export function CategoryBadge({ categoryId }) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${catColors[categoryId] || 'bg-white/[0.06] text-white/50'}`}>
      {cat.label}
    </span>
  );
}

export function StatusBadge({ statusId }) {
  const st = STATUSES.find((s) => s.id === statusId);
  if (!st) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${statusColors[statusId] || 'bg-white/[0.06] text-white/50'}`}>
      {st.label}
    </span>
  );
}
