const { CognitoJwtVerifier } = require('aws-jwt-verify');
const Response = require('../classes/response.class');

const jwtAuth = async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const token = req.headers.authorization;
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
