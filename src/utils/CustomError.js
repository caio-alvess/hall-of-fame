class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 499 ? 'Fail' : 'Error';
        this.message = message;
        // this.headers = headers;
        // Error.captureStackTrace(this, this.constructor);
    }
};
module.exports = CustomError;