const FS = require("./fs_core");

module.exports = {
    to_json:    async function(FILE){
        try {
            const FOLDER = "data";            
            const RES   = await csv2json(FOLDER,FILE);       
            return RES;
        } catch (error) {    
            return false;
        }
    },

    month_avr:    async function(YEAR){
        try {
            const RES = await price_month_avr(YEAR);
            return RES;
        } catch (error) {    
            return false;
        }
    }
}

async function price_month_avr(YEAR) {
    const object    = await FS.data_json("data/save/price","KADX_농산품데이터_"+YEAR);
    const response  = {}

    //object["월"]["지역명"][일]
    
    for (const CODE in object) {
        const RAWDATA  = {};
        if(object[CODE].NAME != undefined){            
            for (const MONTH in object[CODE]) {
                if(RAWDATA[CODE] == undefined) {
                    RAWDATA[CODE] = {
                        NAME: object[CODE].NAME,
                        CODE: object[CODE].CODE                        
                    };
                }
                if(object[CODE][MONTH]["01"] != undefined){
                    if(RAWDATA[CODE][MONTH] == undefined){ 
                        RAWDATA[CODE][MONTH] = {
                            SAMPLE:0,
                            R_NMYR:0,
                            R_BFRT:0,
                            P_WHSL:0,
                            P_RTSL:0
                        }; 
                    }                    
                    for (const DAY in object[CODE][MONTH]) {
                        RAWDATA[CODE][MONTH].SAMPLE ++;
                        RAWDATA[CODE][MONTH].R_NMYR += object[CODE][MONTH][DAY].R_NMYR*1;
                        RAWDATA[CODE][MONTH].R_BFRT += object[CODE][MONTH][DAY].R_BFRT*1;
                        RAWDATA[CODE][MONTH].P_WHSL += object[CODE][MONTH][DAY].P_WHSL*1;
                        RAWDATA[CODE][MONTH].P_RTSL += object[CODE][MONTH][DAY].P_RTSL*1;
                    } 
                }
            }
            if(response[CODE] == undefined){ 
                response[CODE] = {
                    NAME:   RAWDATA[CODE].NAME,
                    CODE:   RAWDATA[CODE].CODE                    
                }
                for (const MONTH in RAWDATA[CODE]) {
                    if(RAWDATA[CODE][MONTH].R_NMYR != undefined){
                        response[CODE][MONTH] = {
                            R_NMYR: (RAWDATA[CODE][MONTH].R_NMYR/RAWDATA[CODE][MONTH].SAMPLE).toFixed(2)*1,
                            R_BFRT: (RAWDATA[CODE][MONTH].R_BFRT/RAWDATA[CODE][MONTH].SAMPLE).toFixed(2)*1,
                            P_WHSL: (RAWDATA[CODE][MONTH].P_WHSL/RAWDATA[CODE][MONTH].SAMPLE).toFixed(2)*1,
                            P_RTSL: (RAWDATA[CODE][MONTH].P_RTSL/RAWDATA[CODE][MONTH].SAMPLE).toFixed(2)*1
                        };
                    }
                }
            }
        }         
    }
    const RESPONSE = FS.fileMK_JSON("data/processing/month_avr_price",response,YEAR+"_가격평균");
    return RESPONSE;
}

async function csv2json(FOLDER,FILE) {
    const RAW_DATA  = await FS.data_csv(FOLDER,FILE);
    const DATA_SET  = {};

    for (let index  = 0; index < RAW_DATA.length; index++) {
        const DATA  = RAW_DATA[index];

        const YEAR  = Math.floor(DATA[0]/10000);
        let   MONTH = Math.floor((DATA[0]/100)%100);
        let   DAY   = Math.floor(DATA[0]%100);
        if(YEAR){
            if(MONTH<10)    MONTH   = "0"+MONTH;
            if(DAY<10)      DAY     = "0"+DAY;

            if(DATA_SET[YEAR] == undefined){ DATA_SET[YEAR] = {YEAR:YEAR}; }
            if(DATA_SET[YEAR][DATA[5]] == undefined){
                DATA_SET[YEAR][DATA[5]] = {
                    NAME:DATA[2],
                    CODE:DATA[1]
                }; 
            }      
            if(DATA_SET[YEAR][DATA[5]][MONTH] == undefined){ DATA_SET[YEAR][DATA[5]][MONTH] = {}; }
            if(DATA_SET[YEAR][DATA[5]][MONTH][DAY] == undefined){
                DATA_SET[YEAR][DATA[5]][MONTH][DAY] = {
                    R_NMYR:DATA[3],
                    R_BFRT:DATA[4],
                    P_WHSL:DATA[6],
                    P_RTSL:DATA[7]
                };
            }
        }          
    }
    let RESPONSE;
    
    for (const key in DATA_SET) {
        RESPONSE = FS.fileMK_JSON("data/save/price",DATA_SET[key],"KADX_농산품데이터_"+key);
    }    
    return RESPONSE;
}   

/* ////json Data set 

const DATE = data[index][2].split("-");
    // year:YEAR,
    // month:MONTH,
    // day:DAY,

{
    YEAR:{                  //년
        YEAR:   YEAR;       //년
        MONTH:{             //월
            DATA[5]:{       //품종코드
                NAME:DATA[2]//품목명
                CODE:DATA[1]//품목코드
                DAY:{                    
                }
            }
        }
    }
}
*/