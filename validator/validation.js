const Ajv = require('ajv');
const ajv = new Ajv();

exports.validate = (schema, params) => {
  const validate = ajv.compile(schema);
  return validate(params);
};
