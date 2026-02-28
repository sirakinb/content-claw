import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, CalendarDays, PlusCircle, Sparkles, MessageSquareHeart } from 'lucide-react';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/library', icon: Library, label: 'Content Library' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/testimonials', icon: MessageSquareHeart, label: 'Testimonials' },
];

export default function Sidebar({ onNewContent }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white/[0.02] border-r border-border flex flex-col z-30 backdrop-blur-xl">
      {/* Brand */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Aki</h1>
          <p className="text-[11px] text-white/30 -mt-0.5 tracking-widest uppercase">Content Hub</p>
        </div>
      </div>

      {/* New Content Button */}
      <div className="px-4 mb-2">
        <button
          onClick={onNewContent}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all shadow-lg cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #9333ea, #7e22cecc)',
            boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3)',
          }}
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
                  ? 'bg-white/[0.08] text-white shadow-sm'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-[11px] text-white/15 tracking-wider">@sirakinb</p>
      </div>
    </aside>
  );
}
