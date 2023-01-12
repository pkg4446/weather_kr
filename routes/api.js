const express = require('express');
const router  = express.Router();
const weather = require("../controller/weather");
const controller = require('../function/controller');


router.post('/', async function(req, res) {
    const response = await weather.read(req.body.YEAR);
    return res.json(response);
    });

router.post('/remake', async function(req, res) {
    let response
    for (let index = 2000; index < 2023; index++) {
        response = await controller.month_avr(index);        
    }
    return res.json(response);
    });
    
module.exports = router;