import { X, Play, FileText, Share2, Tag, CheckCircle2, Trash2 } from 'lucide-react';
import type { Task } from '../types';

interface Props {
  task: Task;
  onClose: () => void;
  onDelete: (taskId: string) => void;
}

export function TaskModal({ task, onClose, onDelete }: Props) {
  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-100 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-glow-strong animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-light text-sm font-semibold border border-primary/30">
              {task.scriptNumber || 'Idea'}
            </span>
            <h2 className="text-xl font-bold text-white max-w-lg truncate" title={task.content}>
              {task.content}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                  onClose();
                }
              }}
              className="p-2 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-gray-300 space-y-8 scrollbar-hide">
          
          {/* Metadata Bar */}
          {(task.category || task.status) && (
            <div className="flex flex-wrap gap-4 text-sm bg-surface-50 p-4 rounded-xl border border-white/5">
              {task.category && (
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-primary-light" />
                  <span className="font-medium text-gray-200">Category:</span>
                  <span>{task.category}</span>
                </div>
              )}
              {task.status && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="font-medium text-gray-200">Status:</span>
                  <span className={task.status.includes('NOT YET') ? 'text-amber-400' : 'text-emerald-400'}>
                    {task.status}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Hooks Section */}
          {(task.hookAudio || task.hookText || task.hookVisual) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Play size={18} className="text-primary" /> 
                The Hook
              </h3>
              <div className="bg-surface-200/50 rounded-xl p-5 border border-white/5 space-y-3">
                {task.hookAudio && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Audio Hook</span>
                    <p className="text-gray-100 text-lg leading-relaxed italic border-l-2 border-primary pl-3">"{task.hookAudio}"</p>
                  </div>
                )}
                {task.hookText && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Text on Screen</span>
                    <p className="text-primary-light font-medium bg-primary/10 inline-block px-2 py-1 rounded">
                      {task.hookText}
                    </p>
                  </div>
                )}
                {task.hookVisual && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Visual Action</span>
                    <p className="text-gray-400">{task.hookVisual}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Caption */}
          {task.caption && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Share2 size={18} className="text-primary" /> 
                Caption & Hashtags
              </h3>
              <div className="bg-surface-200/50 rounded-xl p-5 border border-white/5 whitespace-pre-wrap font-sans text-sm text-gray-300">
                {task.caption}
              </div>
            </div>
          )}

          {/* Full Script */}
          {task.scriptBody && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText size={18} className="text-primary" /> 
                Full Script
              </h3>
              <div className="bg-surface-50 rounded-xl p-6 border border-white/10 whitespace-pre-wrap font-serif text-gray-200 text-lg leading-relaxed">
                {task.scriptBody}
              </div>
            </div>
          )}

          {/* Call to Action */}
          {task.cta && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Call To Action</h3>
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 text-primary-light font-medium">
                "{task.cta}"
              </div>
            </div>
          )}

          {/* Fallback for simple ideas */}
          {!task.scriptBody && !task.hookAudio && !task.caption && (
            <div className="py-12 text-center text-gray-500 flex flex-col items-center gap-3">
              <FileText size={48} className="opacity-20" />
              <p>This is just an idea right now.</p>
              <p className="text-sm">Double click to edit or move to "Approved" to flesh it out.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}