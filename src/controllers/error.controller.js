module.exports = (error, req, res, next) => {
    console.log('inside here');
    /*     if (error instanceof Object) {
            try {
                let headers = {
                    ...error.headers,
                    'Content-Type': 'application/json'
                }
                res.set(headers);
    
            }
            catch (e) {
                console.error('Unable to set headers to response', e);
            }
        } */
    error.statusCode = error || 500;
    error.status = error.status || 'Error';
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    })
};