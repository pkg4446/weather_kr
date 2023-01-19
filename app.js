const express     = require('express');
const indexRouter = require('./routes');
const morgan      = require('morgan');
const dotenv      = require('dotenv');

dotenv.config();

const http  = require('http');
const HTTP_PORT  = process.env.PORT || 3005;
const app = express();
app.use(morgan('dev'));

app.set('trust proxy', '127.0.0.1');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error('${req.method} ${req.url} 라우터가 없습니다.');
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.json({result:false, data:"Invalid router"});
});

let httpServer  = http.createServer(app);
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log("Web server is listening on port %s \n", HTTP_PORT);
});