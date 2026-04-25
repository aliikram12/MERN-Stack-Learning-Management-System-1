/**
 * Custom Error Response class
 * Extends Error with HTTP status code for API responses
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
