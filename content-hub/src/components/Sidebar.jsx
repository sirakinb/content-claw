import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, CalendarDays, PlusCircle, Sparkles } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: Library, label: 'Content Library' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
];

export default function Sidebar({ onNewContent }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-surface-raised border-r border-gray-200/60 flex flex-col z-30">
      {/* Brand */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-ink">Aki</h1>
          <p className="text-[11px] text-ink-muted -mt-0.5 tracking-wide uppercase">Content Hub</p>
        </div>
      </div>

      {/* New Content Button */}
      <div className="px-4 mb-2">
        <button
          onClick={onNewContent}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          New Content
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-ink-muted hover:bg-gray-100 hover:text-ink'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-ink-faint">@sirakinb</p>
      </div>
    </aside>
  );
}
