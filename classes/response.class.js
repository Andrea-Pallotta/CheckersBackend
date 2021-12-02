class Response {
  constructor(data, code) {
    this.data = data;
    this.code = code;
  }

  static fromJSON(json) {
    return Object.assign(new Response(), json);
  }

  static Success(data) {
    return new Response(data, 200);
  }

  static E400() {
    return new Response('Invalid request parameters', 400);
  }

  static E401() {
    return new Response('Request could not be validated', 401);
  }

  static E404(data) {
    return new Response(data, 404);
  }

  static E500(data) {
    return new Response(data, 500);
  }
}

module.exports = Response;
