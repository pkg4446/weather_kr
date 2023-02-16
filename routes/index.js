const express   = require('express');
const router    = express.Router();

//const test      = require('./test');
const front     = require('./front');
const api       = require('./api');
router.use('/',front);
router.use('/api',api);

module.exports  = router;