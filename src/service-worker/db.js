import idb from 'idb';

class DataBase {
  constructor(store, table, val = 1) {
    this.store = store;
    this.table = table;
    this.dbPromise = idb.open(this.store, val, upgradeDB => {
      upgradeDB.createObjectStore(this.table);
    });
  }
  get(key) {
    return this.dbPromise.then(db => {
      return db
        .transaction(this.table)
        .objectStore(this.table)
        .get(key);
    });
  }
  set(key, val) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.table, 'readwrite');

      tx.objectStore(this.table).put(val, key);

      return tx.complete;
    });
  }
  delete(key) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.table, 'readwrite');

      tx.objectStore(this.table).delete(key);

      return tx.complete;
    });
  }
  clear() {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.table, 'readwrite');

      tx.objectStore(this.table).clear();

      return tx.complete;
    });
  }
  keys() {
    return this.dbPromise.then(db => {
      const tx = db.transaction(this.table);
      const keys = [];
      const store = tx.objectStore(this.table);

      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;

        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
}

export default DataBase;
