const express = require('express');
const router  = express.Router();

const save_farm    = require('../function/save_farm');
const save_price   = require('../function/save_price');
const save_weather = require('../function/save_weather');

const api_day      = require('./api_day');
const api_month    = require('./api_month');

router.use('/day',api_day);
router.use('/month',api_month);

router.post('/remake_farm', async function(req, res) {
    let response = false;
    for (let index = 2000; index < 2023; index++) {
        response = await save_farm.split("엽채류_",index);
        response = await save_farm.split("근채류_",index);
        response = await save_farm.split("조미채소_",index);
    }    
    return res.json(response);
    });  

router.post('/tojson_farm', async function(req, res) {
    let response;    
    for (let index = 2000; index < 2023; index++) {
        response = await save_farm.to_json("채소생산량_","엽채류_",index);
        response = await save_farm.to_json("채소생산량_","근채류_",index);
        response = await save_farm.to_json("채소생산량_","조미채소_",index);
    }    
    response = await save_farm.to_json("채소생산량_","조미채소_",2000);
    return res.json(response);
    }); 

router.post('/request_price', async function(req, res) {
    const response = await save_price.httpRequest(req.body.YEAR);
    return res.json(response);
    });  

router.post('/remake_price', async function(req, res) {
    let response;
    for (let year = 2000; year < 2023; year++) {
        response = await save_price.month_avr(year);             
    }     
    return res.json(response);
    });

router.post('/tojson_price', async function(req, res) {
    const FILE  = "KADX_농산품_빅데이터_거래소";
    const response = await save_price.to_json(FILE);
    return res.json(response);
    });   

router.post('/remake_weather', async function(req, res) {
    let response;
    for (let index = 2000; index < 2023; index++) {
        response = await save_weather.month_avr(index);        
    }
    return res.json(response);
    });

router.post('/tojson_weather', async function(req, res) {
    let response;
    const FILEs  = ["기상청자료개방포털2000-2009","기상청자료개방포털2010-2019","기상청자료개방포털2020-2022"];
    for (const FILE of FILEs) {
        response += await save_weather.to_json(FILE);
    }
    return res.json(response);
    });

module.exports = router;