import { useState, useCallback } from 'react';
import { initialContent } from '../data/content';

const STORAGE_KEY = 'aki-content-hub';

function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* fall through */ }
  return initialContent;
}

function saveContent(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useContentStore() {
  const [items, setItems] = useState(loadContent);

  const update = useCallback((updater) => {
    setItems((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveContent(next);
      return next;
    });
  }, []);

  const addItem = useCallback((item) => {
    update((prev) => [{ ...item, id: String(Date.now()) }, ...prev]);
  }, [update]);

  const updateItem = useCallback((id, changes) => {
    update((prev) => prev.map((i) => (i.id === id ? { ...i, ...changes } : i)));
  }, [update]);

  const deleteItem = useCallback((id) => {
    update((prev) => prev.filter((i) => i.id !== id));
  }, [update]);

  return { items, addItem, updateItem, deleteItem };
}
