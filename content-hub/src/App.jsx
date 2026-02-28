import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ContentModal from './components/ContentModal';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Calendar from './pages/Calendar';
import TestimonialsDashboard from './pages/testimonials/TestimonialsDashboard';
import CampaignForm from './pages/testimonials/CampaignForm';
import CampaignDetail from './pages/testimonials/CampaignDetail';
import RespondPage from './pages/testimonials/RespondPage';
import WallOfLove from './pages/testimonials/WallOfLove';
import { useContentStore } from './hooks/useContentStore';

function AppLayout() {
  const { items, addItem, updateItem, deleteItem } = useContentStore();
  const [modal, setModal] = useState({ open: false, item: null });
  const location = useLocation();

  const openNew = () => setModal({ open: true, item: null });
  const openEdit = (item) => setModal({ open: true, item });
  const closeModal = () => setModal({ open: false, item: null });

  const handleSave = (data) => {
    if (modal.item?.id) {
      updateItem(modal.item.id, data);
    } else {
      addItem(data);
    }
  };

  const handleDelete = (id) => deleteItem(id);

  const isFullscreen = location.pathname.startsWith('/respond/') ||
    location.pathname.startsWith('/wall/') ||
    location.pathname.startsWith('/testimonials/new');

  if (isFullscreen) {
    return (
      <Routes>
        <Route path="/respond/:id" element={<RespondPage />} />
        <Route path="/wall/:id" element={<WallOfLove />} />
        <Route path="/testimonials/new" element={<CampaignForm />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar onNewContent={openNew} />
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/" element={<Dashboard items={items} />} />
          <Route path="/library" element={<Library items={items} onEdit={openEdit} onDelete={handleDelete} />} />
          <Route path="/calendar" element={<Calendar items={items} onEdit={openEdit} />} />
          <Route path="/testimonials" element={<TestimonialsDashboard />} />
          <Route path="/testimonials/:id" element={<CampaignDetail />} />
        </Routes>
      </main>
      {modal.open && (
        <ContentModal item={modal.item} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
