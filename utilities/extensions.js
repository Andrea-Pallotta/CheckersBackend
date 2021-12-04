Object.defineProperty(Array.prototype, 'none', {
  value: function (callback) {
    return !this.some(callback);
  },
});
