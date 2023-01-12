const core = require("../function/controller");
const FS   = require("../function/fs_core");

module.exports  = {
    read : async function(YEAR){
        const response = await FS.data_json("data/processing/month_avr",YEAR+"_지역평균");
        return response;
    },
}

async function MK_MONTH_AVR() {
    for (let index = 2000; index < 2023; index++) {
        const jsonFile = await core.month_avr(index);
    }
}

async function MK_FILE() {
    const jsonFile1 = await core.to_json("data","기상청자료개방포털2000-2009");
    const jsonFile2 = await core.to_json("data","기상청자료개방포털2010-2019");
    const jsonFile3 = await core.to_json("data","기상청자료개방포털2020-2022");
}