const { format } = require('date-fns');
const { v4: uuid } = require('uuid')
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async(message, LogFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try{
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', LogFileName), logItem);
    } catch(err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`S{req.method}\t${req.url}\t${req.headers.origin}`, 'reqlog.log');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logEvents, logger };