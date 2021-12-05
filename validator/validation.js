const Ajv = require('ajv');
const ajv = new Ajv();

/**
 * Create an ajv validator that accepts a payoad
 * @param  {JSON} schema
 * @param  {JSON} params
 * @returns {boolean}
 */
exports.validate = (schema, params) => {
  const validate = ajv.compile(schema);
  return validate(params);
};
