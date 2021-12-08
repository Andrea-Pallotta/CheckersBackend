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

const flagged = ['/', '/checks/health', '/favicon.ico'];
/**
 * Middleware to validate JWT from frontend
 * @param  {JSON} req
 * @param  {Object} res
 * @param  {Function} next
 */
const jwtAuth = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  if (flagged.includes(req.path)) return next();
  if (!req.headers.authorization) return res.status(401).json(Response.E401);
  else {
    try {
      const token = extractToken(req.headers.authorization);
      const verifier = CognitoJwtVerifier.create({
        userPoolId: token.payload.iss.split('/')[3],
        tokenUse: 'access',
        clientId: token.payload.client_id,
      });
      await verifier.verify(token.jwtToken);
    } catch {
      return res.status(401).json(Response.E401);
    }
    next();
  }
};

module.exports = jwtAuth;
