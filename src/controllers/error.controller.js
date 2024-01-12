/* function isJSON(str) {
    let newJson = null;
    try {
        newJson = JSON.parse(str);
        return typeof newJson === "object" && newJson !== str || false

    } catch (e) {
        return false;
    }
}; */
module.exports = (error, req, res, next) => {
    if (error.headers instanceof Object) { res.set(error.headers) };
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'Error';

    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    })
};