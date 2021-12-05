/**
 * Class that handles HTTP response codes.
 *
 * @class Response
 */
class Response {
  /**
   * Creates an instance of Response.
   * @param {*} data
   * @param {number} code
   * @memberof Response
   */
  constructor(data, code) {
    this.data = data;
    this.code = code;
  }

  /**
   * Reponse for 200
   *
   * @static
   * @param {*} data
   * @return {Response}
   * @memberof Response
   */
  static Success(data) {
    return new Response(data, 200);
  }

  /**
   * Response for 400
   *
   * @static
   * @return {Response}
   * @memberof Response
   */
  static E400() {
    return new Response('Invalid request parameters', 400);
  }

  /**
   * Response for 401
   *
   * @static
   * @return {Response}
   * @memberof Response
   */
  static E401() {
    return new Response('Request could not be validated', 401);
  }

  /**
   * Reponse for 404
   *
   * @static
   * @param {*} data
   * @return {Response}
   * @memberof Response
   */
  static E404(data) {
    return new Response(data, 404);
  }

  /**
   * Reponse for 404
   *
   * @static
   * @param {*} data
   * @return {Response}
   * @memberof Response
   */
  static E500(data) {
    return new Response(data, 500);
  }

  /**
   * Create a new instance of Response from a JSON object.
   *
   * @static
   * @param {JSON} json
   * @return {Response}
   * @memberof Response
   */
  static fromJSON(json) {
    return Object.assign(new Response(), json);
  }
}

module.exports = Response;
