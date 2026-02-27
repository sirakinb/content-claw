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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-ink">{isEdit ? 'Edit Content' : 'New Content'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={set('title')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-shadow"
              placeholder="What's this content about?"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={set('category')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 bg-white cursor-pointer">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Status</label>
              <select value={form.status} onChange={set('status')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 bg-white cursor-pointer">
                {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Platform</label>
              <select value={form.platform} onChange={set('platform')} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 bg-white cursor-pointer">
                {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Scheduled Date</label>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={set('scheduledDate')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Hook</label>
            <input
              type="text"
              value={form.hook}
              onChange={set('hook')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-shadow"
              placeholder="The opening line that grabs attention"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wider">Script</label>
            <textarea
              value={form.script}
              onChange={set('script')}
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-shadow resize-none"
              placeholder="Full script for the video..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-ink-muted hover:bg-gray-100 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer">
              {isEdit ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
