const DB_NAME = 'aki-testimonials';
const DB_VERSION = 1;
const CAMPAIGNS_STORE = 'campaigns';
const TESTIMONIALS_STORE = 'testimonials';
const VIDEOS_STORE = 'videos';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CAMPAIGNS_STORE)) {
        db.createObjectStore(CAMPAIGNS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(TESTIMONIALS_STORE)) {
        const ts = db.createObjectStore(TESTIMONIALS_STORE, { keyPath: 'id' });
        ts.createIndex('campaignId', 'campaignId', { unique: false });
      }
      if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
        db.createObjectStore(VIDEOS_STORE, { keyPath: 'id' });
      }
    };
  });
}

function tx(storeName, mode = 'readonly') {
  return openDB().then((db) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    return { store, transaction, db };
  });
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---------- Campaigns ----------

export async function getCampaigns() {
  const { store } = await tx(CAMPAIGNS_STORE);
  return promisify(store.getAll());
}

export async function getCampaign(id) {
  const { store } = await tx(CAMPAIGNS_STORE);
  return promisify(store.get(id));
}

export async function saveCampaign(campaign) {
  const { store } = await tx(CAMPAIGNS_STORE, 'readwrite');
  return promisify(store.put(campaign));
}

export async function deleteCampaign(id) {
  const { store } = await tx(CAMPAIGNS_STORE, 'readwrite');
  return promisify(store.delete(id));
}

// ---------- Testimonials ----------

export async function getTestimonials(campaignId) {
  const { store } = await tx(TESTIMONIALS_STORE);
  if (campaignId) {
    const index = store.index('campaignId');
    return promisify(index.getAll(campaignId));
  }
  return promisify(store.getAll());
}

export async function getTestimonial(id) {
  const { store } = await tx(TESTIMONIALS_STORE);
  return promisify(store.get(id));
}

export async function saveTestimonial(testimonial) {
  const { store } = await tx(TESTIMONIALS_STORE, 'readwrite');
  return promisify(store.put(testimonial));
}

export async function deleteTestimonial(id) {
  const { store: vStore } = await tx(VIDEOS_STORE, 'readwrite');
  vStore.delete(id);
  const { store } = await tx(TESTIMONIALS_STORE, 'readwrite');
  return promisify(store.delete(id));
}

// ---------- Video Blobs ----------

export async function saveVideo(id, blob) {
  const { store } = await tx(VIDEOS_STORE, 'readwrite');
  return promisify(store.put({ id, blob }));
}

export async function getVideo(id) {
  const { store } = await tx(VIDEOS_STORE);
  const result = await promisify(store.get(id));
  return result?.blob ?? null;
}

export async function deleteVideo(id) {
  const { store } = await tx(VIDEOS_STORE, 'readwrite');
  return promisify(store.delete(id));
}
