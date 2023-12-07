const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
    logEvents(`S{err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errlog.log');

    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500;
    res.status(status).json({ message: err.message });
    
}

module.exports = errorHandler;