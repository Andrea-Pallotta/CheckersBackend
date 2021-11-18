const addToGlobal = (map, id) => {
  map.set(id, 1);
};

const removeFromGlobal = (map, id) => {
  map.delete(id);
};

const serialize = (map) => {
  return [...map.keys()];
};

module.exports = {
  addToGlobal,
  removeFromGlobal,
  serialize,
};
