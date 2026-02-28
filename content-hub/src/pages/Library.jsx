import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import { CATEGORIES, STATUSES } from '../data/content';

export default function Library({ items, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.hook && item.hook.toLowerCase().includes(search.toLowerCase())) ||
        (item.script && item.script.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const selectClass = 'px-3 py-2.5 rounded-xl bg-white/[0.06] border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer';

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Content Library</h1>
        <p className="text-sm text-white/40 mt-1">{items.length} pieces of content</p>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-border bg-white/[0.03] p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-border text-white text-sm placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
            />
          </div>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-white/[0.04] rounded-xl p-1 border border-border">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === 'grid' ? 'bg-white/[0.1] text-brand-400 shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === 'list' ? 'bg-white/[0.1] text-brand-400 shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <SlidersHorizontal className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">No content matches your filters</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <ContentCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
