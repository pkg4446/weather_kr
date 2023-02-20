const express = require('express');
const router  = express.Router();
const read = require("../controller/read_day");

router.post('/farm', async function(req, res) {
    const response = await read.farm(req.body.YEAR,req.body.TYPE);
    return res.json(response);
    });  

router.post('/farming', async function(req, res) {
    const response = await read.farming(req.body.TYPE);
    return res.json(response);
    });  
        
router.post('/weather', async function(req, res) {
    const response = await read.weather(req.body.YEAR,req.body.MONTH);
    return res.json(response);
    });  

router.post('/price', async function(req, res) {
    const response = await read.price(req.body.YEAR,req.body.MONTH);
    return res.json(response);
    });  

module.exports = router;