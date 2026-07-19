class CustomError extends Error {
  /**
   * Creates a CustomError instances.
   * @param {string} message - Human-readable error explanation.
   * @param {number} statusCode - HTTP status code.
   * @param {Array} [errors=[]] - Specific structural or field validation errors.
   */
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
