class Storage {
  private dataKey: string;

  constructor(dataKey: string = "ADMIN") {
    this.dataKey = dataKey;
  }

  get(key: string): string | null {
    const value = window.localStorage.getItem(this.dataKey + key);
    return value;
  }

  set(key: string, value: string | object): void {
    const v = typeof value === "object" ? JSON.stringify(value) : value;
    window.localStorage.setItem(this.dataKey + key, v);
  }

  remove(key: string): void {
    window.localStorage.removeItem(this.dataKey + key);
  }
}

const storage = new Storage();

export { storage };

export default storage;
