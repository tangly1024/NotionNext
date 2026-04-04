// 文件路径: lib/userDict.js
const DB_NAME = 'AI886_UserDict_DB';
const STORE_NAME = 'dict_entries';
const DB_VERSION = 1;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // 创建仓库，使用复合主键 id: "srcLang|tgtLang|source"
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('srcLang', 'srcLang', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const saveToUserDict = async (srcLang, tgtLang, source, translation) => {
  if (!source || !translation) return;
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const entry = {
      id: `${srcLang}|${tgtLang}|${source.trim()}`,
      srcLang,
      tgtLang,
      source: source.trim(),
      translation: translation.trim(),
      timestamp: Date.now()
    };
    store.put(entry);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

export const matchFromUserDict = async (srcLang, tgtLang, text) => {
  if (!text) return null;
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    // 精确匹配
    const request = store.get(`${srcLang}|${tgtLang}|${text.trim()}`);
    request.onsuccess = (e) => {
      if (e.target.result) {
        resolve([{ translation: e.target.result.translation }]);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => resolve(null);
  });
};

export const getAllUserDict = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = (e) => resolve(e.target.result || []);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const deleteUserDictEntry = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (e) => reject(e.target.error);
  });
};

export const clearUserDict = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (e) => reject(e.target.error);
  });
};
