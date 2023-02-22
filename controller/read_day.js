const { Dir } = require("../function/fs_core");
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

    weather : async function(YEAR,MONTH){
        if(MONTH*1 < 10) MONTH = "0" + MONTH;
        const response = await FS.data_json("data/processing/day_avr_weather",YEAR+"_"+MONTH+"_지역평균");
        return response;
    },

    price : async function(YEAR,MONTH){ 
        if(MONTH*1<10) MONTH = "0" + MONTH;
        const days     = await Dir("data/kamis/"+YEAR+"/"+(MONTH-1));
        const prices   = {}
        for (let day = 1; day <= days.length; day++) {
            let DAY;
            if(day*1<10){DAY = "0" + day;}
            else{DAY = day;}
            const PRICE = await FS.data_json("data/kamis/"+YEAR+"/"+(MONTH-1)+"/",`${YEAR}-${MONTH}-${DAY}`);
            for (const object of PRICE.item) {
                if(prices[object.item_code] == undefined){
                    prices[object.item_code] = {"NAME":object.item_name,"CODE":object.item_code,"PRICE":{"상품":{},"중품":{}}}
                }
                prices[object.item_code].PRICE[object.rank][day] = object.dpr1;
            }
        }
        return prices;
    },
}