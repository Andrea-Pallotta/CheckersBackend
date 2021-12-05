/**
 * Serialize a Map's keys
 * @param  {Map} map
 */
const serialize = (map) => {
  return [...map.keys()];
};

module.exports = {
  serialize,
};
