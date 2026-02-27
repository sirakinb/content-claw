import { useMemo } from 'react';
import { format, isAfter } from 'date-fns';
import { FileText, Clock, Send, PenLine, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getContentStats } from '../data/content';
import { CategoryBadge, StatusBadge } from '../components/Badge';

export default function Dashboard({ items }) {
  const stats = useMemo(() => getContentStats(items), [items]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return items
      .filter((i) => i.status === 'scheduled' && i.scheduledDate && isAfter(new Date(i.scheduledDate), now))
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, 5);
  }, [items]);

  const recentlyPublished = useMemo(() => {
    return items
      .filter((i) => i.status === 'published')
      .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
      .slice(0, 3);
  }, [items]);

  const drafts = useMemo(() => items.filter((i) => i.status === 'draft').slice(0, 4), [items]);

  const statCards = [
    { label: 'Total Content', value: stats.total, icon: FileText, gradient: 'from-brand-500 to-brand-700' },
    { label: 'Scheduled', value: stats.scheduled, icon: Clock, gradient: 'from-amber to-orange-500' },
    { label: 'Published', value: stats.published, icon: Send, gradient: 'from-emerald to-teal-600' },
    { label: 'Drafts', value: stats.draft, icon: PenLine, gradient: 'from-sky to-blue-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
        <p className="text-sm text-ink-muted mt-1">Your content at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, gradient }) => (
          <div key={label} className="bg-surface-raised rounded-2xl border border-gray-200/60 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-ink-faint" />
            </div>
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-ink-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Content */}
        <div className="bg-surface-raised rounded-2xl border border-gray-200/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Upcoming</h2>
            <Link to="/calendar" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-faint py-6 text-center">No upcoming content scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                    <p className="text-[11px] text-ink-muted">{format(new Date(item.scheduledDate), 'EEE, MMM d')}</p>
                  </div>
                  <CategoryBadge categoryId={item.category} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drafts */}
        <div className="bg-surface-raised rounded-2xl border border-gray-200/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Drafts</h2>
            <Link to="/library" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {drafts.length === 0 ? (
            <p className="text-sm text-ink-faint py-6 text-center">No drafts</p>
          ) : (
            <div className="space-y-3">
              {drafts.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <PenLine className="w-4 h-4 text-ink-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryBadge categoryId={item.category} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Published */}
        {recentlyPublished.length > 0 && (
          <div className="bg-surface-raised rounded-2xl border border-gray-200/60 p-5 lg:col-span-2">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Recently Published</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {recentlyPublished.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-emerald/5 border border-emerald/10">
                  <p className="text-sm font-medium text-ink mb-2 line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={item.category} />
                    <span className="text-[11px] text-ink-faint">
                      {item.scheduledDate && format(new Date(item.scheduledDate), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
