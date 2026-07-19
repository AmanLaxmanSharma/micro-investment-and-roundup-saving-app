/**
 * Formats and sends a standardized success response.
 * @param {Object} res - Express response object.
 * @param {string} message - Human-readable success message.
 * @param {Object} [data={}] - Response payload.
 * @param {number} [statusCode=200] - HTTP status code.
 */
export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Formats and sends a standardized error response.
 * @param {Object} res - Express response object.
 * @param {string} message - Human-readable error message.
 * @param {Array} [errors=[]] - Array of specific validation or operational error details.
 * @param {number} [statusCode=500] - HTTP status code.
 */
export const sendError = (res, message, errors = [], statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
