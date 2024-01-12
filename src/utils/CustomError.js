module.exports = class CustomError extends Error {
    constructor(message, statusCode, headers) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 499 ? 'Fail' : 'Error';
        this.headers = headers || null;
        // this.message = message;
    }
};