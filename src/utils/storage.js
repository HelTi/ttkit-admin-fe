class Storage {
  constructor(dataKey = "ADMIN") {
    this.dataKey = dataKey;
  }
  get(key) {
    const value = window.localStorage.getItem(this.dataKey + key);
    return value;
  }
  set(key, value) {
    const v = value;
    window.localStorage.setItem(this.dataKey + key, v);
  }
  remove(key) {
    window.localStorage.removeItem(key);
  }
}

const storage = new Storage();

export { storage };

export default storage;
