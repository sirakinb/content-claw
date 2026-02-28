import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, STATUSES, PLATFORMS } from '../data/content';

const empty = {
  title: '',
  category: 'ai-tools',
  status: 'draft',
  platform: 'tiktok',
  scheduledDate: '',
  hook: '',
  script: '',
};

function getInitialForm(item) {
  if (!item) return empty;
  return {
    ...empty,
    ...item,
    scheduledDate: item.scheduledDate
      ? new Date(item.scheduledDate).toISOString().slice(0, 10)
      : '',
  };
}

export default function ContentModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(() => getInitialForm(item));
  const isEdit = Boolean(item?.id);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      scheduledDate: form.scheduledDate ? new Date(form.scheduledDate).toISOString() : null,
    });
    onClose();
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-border text-white text-sm placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/30 transition-all';
  const labelClass = 'block text-[11px] font-semibold text-white/30 mb-1.5 uppercase tracking-widest';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-950 border border-border rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-bold text-white">{isEdit ? 'Edit Content' : 'New Content'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={set('title')}
              className={inputClass}
              placeholder="What's this content about?"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={set('category')} className={`${inputClass} cursor-pointer`}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={set('status')} className={`${inputClass} cursor-pointer`}>
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Platform</label>
              <select value={form.platform} onChange={set('platform')} className={`${inputClass} cursor-pointer`}>
                {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Scheduled Date</label>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={set('scheduledDate')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hook</label>
            <input
              type="text"
              value={form.hook}
              onChange={set('hook')}
              className={inputClass}
              placeholder="The opening line that grabs attention"
            />
          </div>

          <div>
            <label className={labelClass}>Script</label>
            <textarea
              value={form.script}
              onChange={set('script')}
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Full script for the video..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-all shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #9333ea, #7e22cecc)', boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3)' }}
            >
              {isEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
