/**
 * Return true if none of the elements respect the callback condition
 * Ex. .none((element) => element === 0) -> None of the elements are equal to 0
 * @param  {Object.prototype} Array.prototype
 * @param  {string} 'none'
 * @returns {boolean}
 */
Object.defineProperty(Array.prototype, 'none', {
  value: function (callback) {
    return !this.some(callback);
  },
});
