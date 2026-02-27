import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ContentModal from './components/ContentModal';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Calendar from './pages/Calendar';
import { useContentStore } from './hooks/useContentStore';

export default function App() {
  const { items, addItem, updateItem, deleteItem } = useContentStore();
  const [modal, setModal] = useState({ open: false, item: null });

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

  const handleDelete = (id) => {
    deleteItem(id);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar onNewContent={openNew} />
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard items={items} />} />
            <Route path="/library" element={<Library items={items} onEdit={openEdit} onDelete={handleDelete} />} />
            <Route path="/calendar" element={<Calendar items={items} onEdit={openEdit} />} />
          </Routes>
        </main>
      </div>

      {modal.open && (
        <ContentModal item={modal.item} onSave={handleSave} onClose={closeModal} />
      )}
    </BrowserRouter>
  );
}
