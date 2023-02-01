const { Dir } = require("./fs_core");
const FS = require("./fs_core");

module.exports = {
    to_json:        async function(FILE){
        try {          
            const RES   = await csv2json(FILE);       
            return RES;
        } catch (error) {    
            return false;
        }
    },

    month_avr:      async function(YEAR,MONTH){
        try {
            const RES = await price_month_avr(YEAR,MONTH);
            return RES;
        } catch (error) {    
            return false;
        }
    },

    httpRequest:    async function(YEAR){
        try {
            let RES;
            for (let index = 0; index < 12; index++) {                
                RES = await request(YEAR,index);
            }            
            return RES;
        } catch (error) {    
            return false;
        }
    },
}

async function request(YEAR,MONTH) {
    require('dotenv').config();
    const axios = require('axios');
    const date  = new Date(YEAR,MONTH,1,9);
    let   last  = 28;
    for (let index = 28; index <= 32; index++) {
        const next  = new Date(YEAR,MONTH,index,9);
        if(next.getMonth() != MONTH){
            last = index;
            break;
        }
    }
    /*
    {
      item_name: '방울토마토',
      item_code: '422',
      kind_name: '방울토마토(1kg)',
      kind_code: '01',
      rank: '상품',
      rank_code: '04',
      unit: '5kg',
      day1: '당일 (01/01)',
      dpr1: '-',
      day2: '1일전 (12/31)',
      dpr2: '2,560',
      day3: '1주일전 (12/25)',
      dpr3: '-',
      day4: '2주일전 (12/18)',
      dpr4: '3,000',
      day5: '1개월전',
      dpr5: '2,088',
      day6: '1년전',
      dpr6: '2,904',
      day7: '일평년',
      dpr7: '2,904'
    },
    */
    
    try {
        let RESPONSE = false;
        const dir    = await FS.Dir("data/kamis/"+YEAR+"/"+MONTH);
        let preDay   = "";
        for (let index = 1; index < last; index++) {
            const day   = new Date(YEAR,MONTH,index,9);
            const regday= (day.toISOString()).split("T")[0];
            const URL = `http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_cert_key=${process.env.key}&p_cert_id=${process.env.id}&p_product_cls_code=02&p_regday=${regday}&p_item_category_code=200&p_returntype=json&p_convert_kg_yn=Y`;	
            
            let request  = true;
            let response = null;

            for (const file of dir) {
                if(file == regday+".json") {
                    request = false;
                }
            }

            if(request){
                console.log("no data at " + regday);
                await axios({
                    method: "get", 	// 요청 방식
                    url: URL		// 요청 주소
                })
                .then(async function(res){
                    response = res.data;
                    //if(response.data.item == undefined) response.data = await FS.data_json("data/kamis/"+YEAR+"/"+MONTH,preDay);
                });
                if(response.data.item != undefined){
                    RESPONSE = FS.fileMK_JSON("data/kamis/"+YEAR+"/"+MONTH,response.data,regday);
                    console.log("get price at " + regday);
                }
            }
            preDay = regday;
        }        
        return RESPONSE;
    } catch (error) {
        console.log(error);	
		return false;
    }
}

async function price_month_avr(YEAR,MONTH) {
    
    const response  = {}
    let RESPONSE = false;

    const date  = new Date(YEAR,MONTH,1,9);
    let   last  = 28;
    for (let index = 28; index <= 32; index++) {
        const next  = new Date(YEAR,MONTH,index,9);
        if(next.getMonth() != MONTH){
            last = index;
            break;
        }        
    }
    for (let index = 1; index < 2; index++) {
        const day       = new Date(YEAR,MONTH,index,9);
        const regday    = (day.toISOString()).split("T")[0];
        let   today     = index;
        if(index<10) today = "0"+index;
        const object    = await FS.data_json("data/kamis/"+YEAR+"/"+MONTH,regday);

        for (const leaf of object.item) {
            if(response[leaf.item_code] == undefined){
                response[leaf.item_code] = {
                    NAME:   leaf.item_name,
                    CODE:   leaf.item_code,
                    MONTH:  MONTH,
                    PRICE:  {}
                };
            }            
            if(response[leaf.item_code].PRICE[today] == undefined){
                response[leaf.item_code].PRICE[today] = {
                    H:{R_N:0,R_D:0,P:0},
                    M:{R_N:0,R_D:0,P:0}
                };
            }
            if(object.rank == "상품"){
                console.log("상품");
                if(object.dpr1 == "-"){
                    response[leaf.item_code].PRICE[today].H.P = object.dpr1.replaceAll(",","") * 1;
                }else{
                    response[leaf.item_code].PRICE[today].H.P = object.dpr2.replaceAll(",","") * 1;
                }
            }else{
                console.log("중품");
                if(object.dpr1 == "-"){
                    response[leaf.item_code].PRICE[today].M.P = object.dpr1.replaceAll(",","") * 1;
                }else{
                    response[leaf.item_code].PRICE[today].M.P = object.dpr2.replaceAll(",","") * 1;
                }
            }            
        }        
    }
    console.log(response);
    console.log(response["211"].PRICE);
    return RESPONSE;
}


async function price_month_avr_kadx(YEAR) {
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

async function price_month_avr_kadx(YEAR) {
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

async function csv2json(FILE) {
    const RAW_DATA  = await FS.data_csv("data",FILE,false);
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