const express = require('express');
const router  = express.Router();
const web     = require('../function/web');

router.get('/', async function(req, res) {
    const page = await web.view("index");
    res.send(page);
    });

router.get('/m', async function(req, res) {
    const page = await web.view("month");
    res.send(page);
    });

router.get('/d', async function(req, res) {
    const page = await web.view("day");
    res.send(page);
    });
    
module.exports = router;