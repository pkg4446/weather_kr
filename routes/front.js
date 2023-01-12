const express = require('express');
const router  = express.Router();
const web     = require('../function/web');

router.get('/', async function(req, res) {
    const page = await web.view("main");
    res.send(page);
    });
    
module.exports = router;