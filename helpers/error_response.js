/***
 * Responsible for returning error codes in unified format
 * @param message
 * @returns {{error: *}}
 */
const error_response = function(message) {
    return {"error" : message}
};

module.exports = { error_response };