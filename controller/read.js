const FS   = require("../function/fs_core");

module.exports  = {
    farm : async function(YEAR,TYPE){
        const response = await FS.data_json("data/processing/farm_type",YEAR+"_"+TYPE);
        return response;
    },

    farming : async function(TYPE){
        const response = await FS.data_json("data/save/lifecycle",TYPE);
        return response;
    },

    weather : async function(YEAR){
        const response = await FS.data_json("data/processing/month_avr_weather",YEAR+"_지역평균");
        return response;
    },

    price : async function(YEAR){
        const response = await FS.data_json("data/processing/month_avr_price",YEAR+"_가격평균");
        return response;
    },
}