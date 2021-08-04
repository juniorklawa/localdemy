export default {
  setItem(key: string, value: string) {
    return Promise.resolve().then(() => {
      return localStorage.setItem(key, value);
    });
  },
  getItem(key: string) {
    return Promise.resolve().then(() => {
      return localStorage.getItem(key);
    });
  },
};
