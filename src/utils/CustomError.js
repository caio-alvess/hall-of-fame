module.exports = class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 499 ? 'Fail' : 'Error';
        Error.captureStackTrace(this, this.constructor);
    }
};
