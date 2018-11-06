import localForage from 'localforage';

class DataBase {
  constructor(store = 'antiFb', table = 'localforage', val = 1) {
    this.localForage = localForage;
    this.localForage.config({
      name: table,
      storeName: store,
      version: val
    });
  }
  get(key) {
    return this.localForage.getItem(key);
  }
  getItem = this.get;
  set(key, val) {
    return this.localForage.setItem(key, val);
  }
  setItem = this.set;

  delete(key) {
    return this.localForage.removeItem(key);
  }
  removeItem = this.delete;
  clear() {
    return this.localForage.clear();
  }
  keys() {
    return this.localForage.keys();
  }
  key(id) {
    return this.localForage.key(id);
  }
}

export default DataBase;
