const FS   = require("../function/fs_core");

module.exports  = {
    weather : async function(YEAR){
        const response = await FS.data_json("data/processing/month_avr_weather",YEAR+"_지역평균");
        return response;
    },

    price : async function(YEAR){
        const response = await FS.data_json("data/processing/month_avr_price",YEAR+"_가격평균");
        return response;
    },
}