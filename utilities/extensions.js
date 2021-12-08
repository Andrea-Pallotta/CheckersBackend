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

/**
 * Number prototype function to check if number is in specified range.
 *
 * @param {*} lower
 * @param {*} upper
 * @param {*} included
 * @returns
 */
Number.prototype.inRange = function (lower, upper, included = false) {
  if (included === true) {
    if (!isNaN(lower) && !isNaN(upper)) return this >= lower && this <= upper;
    if (!isNaN(lower) && isNaN(upper)) return this >= lower;
    if (isNaN(lower) && !isNaN(upper)) return this <= upper;
  }

  if (!isNaN(lower) && !isNaN(upper)) return this > lower && this < upper;
  if (!isNaN(lower) && isNaN(upper)) return this > lower;
  if (isNaN(lower) && !isNaN(upper)) return this < upper;
};
