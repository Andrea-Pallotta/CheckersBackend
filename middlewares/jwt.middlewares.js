const { CognitoJwtVerifier } = require('aws-jwt-verify');
const Response = require('../classes/response.class');

/**
 * Extract Token from HTTP header
 * @param  {JSON} auth
 */
const extractToken = (auth) => {
  const split = auth.split(' ');
  const type = split[0];
  const token = JSON.parse(split[1]);

  if (token && type === 'Bearer') {
    return token;
  }

  return null;
};

/**
 * Middleware to validate JWT from frontend
 * @param  {JSON} req
 * @param  {Object} res
 * @param  {Function} next
 */
const jwtAuth = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const token = extractToken(req.headers.authorization);
    const verifier = CognitoJwtVerifier.create({
      userPoolId: token.payload.iss.split('/')[3],
      tokenUse: 'access',
      clientId: token.payload.client_id,
    });
    await verifier.verify(token.jwtToken);
  } catch (err) {
    console.log(`validation failed ${err}`);
    return res.status(401).send(Response.E401);
  }
  next();
};

module.exports = jwtAuth;
