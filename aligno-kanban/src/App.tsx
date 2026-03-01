import { KanbanBoard } from './components/KanbanBoard';
import { LayoutDashboard, Calendar, Settings, PlusCircle, Search, Bell } from 'lucide-react';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-white overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="h-16 border-b border-white/5 bg-surface-100/40 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-light to-primary flex items-center justify-center shadow-glow">
              <span className="font-bold text-white tracking-tighter">CC</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Content Claw</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <a href="#" className="px-3 py-1.5 rounded-md bg-white/5 text-gray-200 text-sm font-medium flex items-center gap-2">
              <LayoutDashboard size={16} />
              Board
            </a>
            <a href="#" className="px-3 py-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm font-medium flex items-center gap-2">
              <Calendar size={16} />
              Calendar
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search content..." 
              className="bg-surface-200/50 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-64 placeholder:text-gray-600"
            />
          </div>
          <button className="text-gray-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="User" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 z-10 relative">
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
              Content Workflow
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-primary/30 text-primary-light bg-primary/10">Active</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage, approve, and track your content pipeline.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors text-gray-400">
              <Settings size={18} />
            </button>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-glow">
              <PlusCircle size={16} />
              New Idea
            </button>
          </div>
        </div>
        
        {/* Kanban Board Container */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
}

export default App;
