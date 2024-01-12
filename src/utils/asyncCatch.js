module.exports = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next))
        .catch(err => {
            console.log(err);
            return next(err);
        })
}
/* module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err))
    }
} */