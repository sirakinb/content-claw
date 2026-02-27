import { useState, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  format, isSameMonth, isToday, addMonths, subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryBadge } from '../components/Badge';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ items, onEdit }) {
  const [current, setCurrent] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current));
    const end = endOfWeek(endOfMonth(current));
    return eachDayOfInterval({ start, end });
  }, [current]);

  const itemsByDate = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      if (!item.scheduledDate) return;
      const key = format(new Date(item.scheduledDate), 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [items]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Content Calendar</h1>
        <p className="text-sm text-ink-muted mt-1">Plan and visualize your content schedule</p>
      </div>

      {/* Month Navigation */}
      <div className="bg-surface-raised rounded-2xl border border-gray-200/60 p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCurrent((c) => subMonths(c, 1))}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-ink-muted" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-ink">{format(current, 'MMMM yyyy')}</h2>
          </div>
          <button
            onClick={() => setCurrent((c) => addMonths(c, 1))}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-ink-muted" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-px mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-ink-muted uppercase tracking-wider py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayItems = itemsByDate[key] || [];
            const inMonth = isSameMonth(day, current);
            const today = isToday(day);

            return (
              <div
                key={key}
                className={`min-h-[100px] p-2 bg-white transition-colors ${
                  !inMonth ? 'bg-gray-50/50' : ''
                } ${today ? 'ring-2 ring-inset ring-brand-400' : ''}`}
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                  today
                    ? 'bg-brand-600 text-white'
                    : inMonth
                    ? 'text-ink'
                    : 'text-ink-faint'
                }`}>
                  {format(day, 'd')}
                </span>

                <div className="mt-1 space-y-1">
                  {dayItems.slice(0, 2).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onEdit(item)}
                      className="w-full text-left p-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 transition-colors cursor-pointer"
                    >
                      <p className="text-[10px] font-medium text-brand-800 truncate leading-tight">{item.title}</p>
                    </button>
                  ))}
                  {dayItems.length > 2 && (
                    <p className="text-[10px] text-ink-faint text-center">+{dayItems.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled List */}
      <div className="mt-6 bg-surface-raised rounded-2xl border border-gray-200/60 p-5">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">
          Scheduled for {format(current, 'MMMM yyyy')}
        </h2>
        {(() => {
          const monthItems = items
            .filter((i) => {
              if (!i.scheduledDate) return false;
              const d = new Date(i.scheduledDate);
              return isSameMonth(d, current);
            })
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

          if (monthItems.length === 0) {
            return <p className="text-sm text-ink-faint text-center py-6">Nothing scheduled this month</p>;
          }

          return (
            <div className="space-y-2">
              {monthItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onEdit(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left cursor-pointer"
                >
                  <div className="w-12 text-center flex-shrink-0">
                    <p className="text-lg font-bold text-ink leading-none">{format(new Date(item.scheduledDate), 'd')}</p>
                    <p className="text-[10px] text-ink-muted uppercase">{format(new Date(item.scheduledDate), 'EEE')}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                    {item.hook && <p className="text-[11px] text-ink-muted truncate italic">"{item.hook}"</p>}
                  </div>
                  <CategoryBadge categoryId={item.category} />
                </button>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
