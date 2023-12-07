const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const { logger,logEvents } = require('./middleware/logger');
const corsOptions = require('./config/corsOptions');
const cors = require('cors');
require('dotenv/config');
const errorHandler = require('./middleware/errorHandler');

// console.log(process.env.NODE_ENV, process.env.PORT);


app.use(logger);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

mongoose.connect(process.env.MONGODB)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`server running on port ${process.env.PORT}`));
    });

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErroLog.log');
});

