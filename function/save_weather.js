const FS = require("./fs_core");

module.exports = {
    to_json:    async function(FILE){
        try {        
            const RES   = await csv2json(FILE);       
            return RES;
        } catch (error) {    
            return false;
        }
    },

    month_avr:    async function(YEAR){
        try {
            //const RES = await region_month_avr(YEAR);
            const RES = await region_day_avr(YEAR);
            return RES;
        } catch (error) {    
            return false;
        }
    }
}

async function region_day_avr(YEAR) {
    const object    = await FS.data_json("data/save/weather","기상청자료개방포털_"+YEAR);
    const response  = {}
    //object["월"]["지역명"][일]
    for (const MONTH in object) {
        const STATE = ["강원도","경기도","경상남도","경상북도","광주광역시","대구광역시","대전광역시","부산광역시","서울특별시","세종특별자치시","울산광역시","인천광역시","전라남도","전라북도","제주도","충청남도","충청북도"];
        if(response[MONTH] == undefined) response[MONTH] = {};
        for (const REGION of STATE) {
            const RAWDATA  = {
                REGION : REGION,                
                SAMPLE : {},
                DAY:{}                
            }
            for (const state in object[MONTH]) {
                if(object[MONTH][state].REGION == REGION){
                    for (const DAY in object[MONTH][state]) {
                        if(RAWDATA.DAY[DAY] == undefined){
                            RAWDATA.SAMPLE[DAY] = 0;
                            RAWDATA.DAY[DAY] = {
                            TEMP:{            //온도 °C
                                AVR: 0,   //평균
                                LOW: 0,   //최저
                                HIGH:0    //최고
                            },
                            RAIN:  0,   //강수량 mm
                            WIND:{            //바람 m/s
                                AVR: 0,   //평균
                                MAX: 0,   //최대
                                DIR: 0    //풍향 °
                            },
                            HUMI:{            //습도 %
                                AVR: 0,  //평균 상대습도
                                MIN: 0,  //최소 상대습도
                                DEW: 0,  //평균 이슬점 °C
                            },
                            SUN:{
                                PH:  0,  //MJ/m2
                                SUM: 0   //MJ/m2
                            },
                            SNOW: 0
                            }
                        }
                        if (object[MONTH][state][DAY].TEMP != undefined) {
                            RAWDATA.SAMPLE[DAY]++;
                            RAWDATA.DAY[DAY].TEMP.AVR += object[MONTH][state][DAY].TEMP.AVR*1;
                            RAWDATA.DAY[DAY].TEMP.LOW += object[MONTH][state][DAY].TEMP.LOW*1;
                            RAWDATA.DAY[DAY].TEMP.HIGH += object[MONTH][state][DAY].TEMP.HIGH*1;
                        
                            RAWDATA.DAY[DAY].RAIN += object[MONTH][state][DAY].RAIN*1;
                            RAWDATA.DAY[DAY].SNOW += object[MONTH][state][DAY].SNOW*1;

                            RAWDATA.DAY[DAY].WIND.AVR += object[MONTH][state][DAY].WIND.AVR*1;
                            RAWDATA.DAY[DAY].WIND.DIR += object[MONTH][state][DAY].WIND.DIR*1;
                            RAWDATA.DAY[DAY].WIND.MAX += object[MONTH][state][DAY].WIND.MAX*1;
                                        
                            RAWDATA.DAY[DAY].HUMI.AVR += object[MONTH][state][DAY].HUMI.AVR*1;
                            RAWDATA.DAY[DAY].HUMI.DEW += object[MONTH][state][DAY].HUMI.DEW*1;
                            RAWDATA.DAY[DAY].HUMI.MIN += object[MONTH][state][DAY].HUMI.MIN*1;
                        
                            RAWDATA.DAY[DAY].SUN.SUM += object[MONTH][state][DAY].SUN.SUM*1;
                            RAWDATA.DAY[DAY].SUN.PH += object[MONTH][state][DAY].SUN.PH*1;
                        }
                        delete RAWDATA.DAY.CODE;
                        delete RAWDATA.DAY.REGION;
                    }
                }       
            }
            const PROCESSING = {}
            for (const key in RAWDATA.DAY) {     
                PROCESSING[key] = {
                    TEMP: { AVR: (RAWDATA.DAY[key].TEMP.AVR/RAWDATA.SAMPLE[key]).toFixed(2)*1, LOW: (RAWDATA.DAY[key].TEMP.LOW/RAWDATA.SAMPLE[key]).toFixed(2)*1, HIGH: (RAWDATA.DAY[key].TEMP.HIGH/RAWDATA.SAMPLE[key]).toFixed(2)*1 },
                    RAIN: (RAWDATA.DAY[key].RAIN/RAWDATA.SAMPLE[key]).toFixed(2)*1,
                    WIND: { AVR: (RAWDATA.DAY[key].WIND.AVR/RAWDATA.SAMPLE[key]).toFixed(2)*1, MAX: (RAWDATA.DAY[key].WIND.MAX/RAWDATA.SAMPLE[key]).toFixed(2)*1, DIR: (RAWDATA.DAY[key].WIND.DIR/RAWDATA.SAMPLE[key]).toFixed(2)*1},
                    HUMI: { AVR: (RAWDATA.DAY[key].HUMI.AVR/RAWDATA.SAMPLE[key]).toFixed(2)*1, MIN: (RAWDATA.DAY[key].HUMI.MIN/RAWDATA.SAMPLE[key]).toFixed(2)*1, DEW: (RAWDATA.DAY[key].HUMI.DEW/RAWDATA.SAMPLE[key]).toFixed(2)*1 },
                    SUN: { PH: (RAWDATA.DAY[key].SUN.PH/RAWDATA.SAMPLE[key]).toFixed(2)*1, SUM: (RAWDATA.DAY[key].SUN.SUM/RAWDATA.SAMPLE[key]).toFixed(2)*1},
                    SNOW: (RAWDATA.DAY[key].SNOW/RAWDATA.SAMPLE[key]).toFixed(2)*1
                }
            }
            response[MONTH][RAWDATA.REGION] = PROCESSING;
        }
    }   
    for (const key in response) {
        console.log(key);
    }
    return response;
}

async function region_month_avr(YEAR) {
    const object    = await FS.data_json("data/save/weather","기상청자료개방포털_"+YEAR);
    const response  = {}
    //object["월"]["지역명"][일]
    for (const MONTH in object) {
        const STATE = ["강원도","경기도","경상남도","경상북도","광주광역시","대구광역시","대전광역시","부산광역시","서울특별시","세종특별자치시","울산광역시","인천광역시","전라남도","전라북도","제주도","충청남도","충청북도"];
        for (const REGION of STATE) {
            const RAWDATA  = {
                MONTH  : MONTH,
                REGION : REGION,
                SAMPLE : 0,
                TEMP:{            //온도 °C
                    AVR: 0,   //평균
                    LOW: 0,   //최저
                    HIGH:0    //최고
                },
                RAIN:  0,   //강수량 mm
                WIND:{            //바람 m/s
                    AVR: 0,   //평균
                    MAX: 0,   //최대
                    DIR: 0    //풍향 °
                },
                HUMI:{            //습도 %
                    AVR: 0,  //평균 상대습도
                    MIN: 0,  //최소 상대습도
                    DEW: 0,  //평균 이슬점 °C
                },
                SUN:{
                    PH:  0,  //MJ/m2
                    SUM: 0   //MJ/m2
                },
                SNOW: 0
            }
            for (const state in object[MONTH]) {        
                if(object[MONTH][state].REGION == REGION){
                    for (const DAY in object[MONTH][state]) {
                        if (object[MONTH][state][DAY].TEMP != undefined) {
                            RAWDATA.SAMPLE++;
                            RAWDATA.TEMP.AVR += object[MONTH][state][DAY].TEMP.AVR*1;
                            RAWDATA.TEMP.LOW += object[MONTH][state][DAY].TEMP.LOW*1;
                            RAWDATA.TEMP.HIGH += object[MONTH][state][DAY].TEMP.HIGH*1;
                         
                            RAWDATA.RAIN += object[MONTH][state][DAY].RAIN*1;
                            RAWDATA.SNOW += object[MONTH][state][DAY].SNOW*1;

                            RAWDATA.WIND.AVR += object[MONTH][state][DAY].WIND.AVR*1;
                            RAWDATA.WIND.DIR += object[MONTH][state][DAY].WIND.DIR*1;
                            RAWDATA.WIND.MAX += object[MONTH][state][DAY].WIND.MAX*1;
                                          
                            RAWDATA.HUMI.AVR += object[MONTH][state][DAY].HUMI.AVR*1;
                            RAWDATA.HUMI.DEW += object[MONTH][state][DAY].HUMI.DEW*1;
                            RAWDATA.HUMI.MIN += object[MONTH][state][DAY].HUMI.MIN*1;
                         
                            RAWDATA.SUN.SUM += object[MONTH][state][DAY].SUN.SUM*1;
                            RAWDATA.SUN.PH += object[MONTH][state][DAY].SUN.PH*1;
                        }
                    }
                }       
            }
            const DATA = {
                TEMP: { AVR: (RAWDATA.TEMP.AVR/RAWDATA.SAMPLE).toFixed(2)*1, LOW: (RAWDATA.TEMP.LOW/RAWDATA.SAMPLE).toFixed(2)*1, HIGH: (RAWDATA.TEMP.HIGH/RAWDATA.SAMPLE).toFixed(2)*1 },
                RAIN: (RAWDATA.RAIN/RAWDATA.SAMPLE).toFixed(2)*1,
                WIND: { AVR: (RAWDATA.WIND.AVR/RAWDATA.SAMPLE).toFixed(2)*1, MAX: (RAWDATA.WIND.MAX/RAWDATA.SAMPLE).toFixed(2)*1, DIR: (RAWDATA.WIND.DIR/RAWDATA.SAMPLE).toFixed(2)*1},
                HUMI: { AVR: (RAWDATA.HUMI.AVR/RAWDATA.SAMPLE).toFixed(2)*1, MIN: (RAWDATA.HUMI.MIN/RAWDATA.SAMPLE).toFixed(2)*1, DEW: (RAWDATA.HUMI.DEW/RAWDATA.SAMPLE).toFixed(2)*1 },
                SUN: { PH: (RAWDATA.SUN.PH/RAWDATA.SAMPLE).toFixed(2)*1, SUM: (RAWDATA.SUN.SUM/RAWDATA.SAMPLE).toFixed(2)*1},
                SNOW: (RAWDATA.SNOW/RAWDATA.SAMPLE).toFixed(2)*1
            }
            if(response[RAWDATA.MONTH] == undefined)    response[RAWDATA.MONTH]={};
            if(response[RAWDATA.MONTH][RAWDATA.REGION] == undefined) response[RAWDATA.MONTH][RAWDATA.REGION]=DATA;
        }
    }    
    delete response.UNIT;
    delete response.YEAR;
    const RESPONSE = FS.fileMK_JSON("data/processing/month_avr_weather",response,YEAR+"_지역평균");
    return RESPONSE;
}

async function csv2json(FILE) {
    const RAW_DATA = await FS.data_csv("data",FILE,false);
    const DATA_SET = {};

    for (let index = 1; index < RAW_DATA.length; index++) {
        const DATA  = RAW_DATA[index];
        if(DATA[0]){
            const DATE  = DATA[2].split("-");
            const YEAR  = DATE[0];
            const MONTH = DATE[1];
            const DAY   = DATE[2];

            if(DATA_SET[YEAR] == undefined) 
                DATA_SET[YEAR] = {
                    UNIT:{
                        TEMP : "°C",
                        RAIN : "mm",
                        WIND : "m/s",
                        DIR  : "°",
                        DEW  : "°C",
                        SUN  : "MJ/m2"
                    }
                };

            if(DATA_SET[YEAR].YEAR == undefined) 
                DATA_SET[YEAR].YEAR = YEAR;

            if(DATA_SET[YEAR][MONTH] == undefined) 
                DATA_SET[YEAR][MONTH] = {};

            if(DATA_SET[YEAR][MONTH][DATA[1]] == undefined){
                DATA_SET[YEAR][MONTH][DATA[1]] = {};
                DATA_SET[YEAR][MONTH][DATA[1]].CODE = DATA[0];
                DATA_SET[YEAR][MONTH][DATA[1]].REGION = region(DATA[0]);
            }
                
            if(DATA_SET[YEAR][MONTH][DATA[1]][DAY] == undefined) {
                DATA_SET[YEAR][MONTH][DATA[1]][DAY] = {};
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].TEMP = {};
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].TEMP.AVR  = DATA[3];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].TEMP.LOW  = DATA[4];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].TEMP.HIGH = DATA[5];
                
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].RAIN = DATA[6];

                DATA_SET[YEAR][MONTH][DATA[1]][DAY].WIND = {};
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].WIND.AVR  = DATA[8];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].WIND.MAX  = DATA[7];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].WIND.DIR  = DATA[9];

                DATA_SET[YEAR][MONTH][DATA[1]][DAY].HUMI = {};       
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].HUMI.AVR = DATA[12];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].HUMI.MIN = DATA[11];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].HUMI.DEW = DATA[10];
                
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].SUN = {};       
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].SUN.PH   = DATA[13];
                DATA_SET[YEAR][MONTH][DATA[1]][DAY].SUN.SUM  = DATA[14];

                DATA_SET[YEAR][MONTH][DATA[1]][DAY].SNOW = DATA[15];
            }                   
        }
    }

    let RESPONSE;
    for (const key in DATA_SET) {
        RESPONSE = FS.fileMK_JSON("data/save",DATA_SET[key],"기상청자료개방포털_"+key);
    }
    return RESPONSE;
}   

/* ////json Data set 

const DATE = data[index][2].split("-");
    // year:YEAR,
    // month:MONTH,
    // day:DAY,

{
    UNIT:{
        "TEMP":"°C",
        "RAIN":"mm"
        "WIND":"m/s"
        "DIR" :"°",
        "DEW" :"°C",
        "SUN" :"MJ/m2"
    },
    YEAR:{                           //년
        YEAR:   YEAR;                //년
        MONTH:{                       //월
            DATA[1]:{                   //지점명
                CODE:   DATA[0],        //지점
                REGION: region(DATA[0]),//특별시,광역시,도
                DAY:{               //일
                    "TEMP":{            //온도 °C
                        AVR: DATA[3],   //평균
                        LOW: DATA[4],   //최저
                        HIGH:DATA[5]    //최고
                    },
                    "RAIN":  DATA[6],   //강수량 mm
                    "WIND":{            //바람 m/s
                        AVR: DATA[8],   //평균
                        MAX: DATA[7],   //최대
                        DIR: DATA[9]    //풍향 °
                    },
                    "HUMI":{            //습도 %
                        AVR: DATA[12],  //평균 상대습도
                        MIN: DATA[11],  //최소 상대습도
                        DEW: DATA[10],  //평균 이슬점 °C
                    },
                    "SUN":{
                        PH:  DATA[13],  //MJ/m2*h
                        SUM: DATA[14]   //MJ/m2*24*h
                    },
                    "SNOW": DATA[15]
                }
            }
        }
    }
}
*/

function region(CODE) {
    const REGION = {
        "강원도":[105,100,106,104,93,214,90,121,114,211,217,95,101,216,212],
        "경기도":[98,119,202,203,99],
        "경상남도":[294,284,253,295,288,255,289,257,263,192,155,162,264,285],
        "경상북도":[283,279,273,271,137,136,277,272,281,115,130,278,276,138],
        "광주광역시":[156],
        "대구광역시":[143,176],
        "대전광역시":[133],
        "부산광역시":[159],
        "서울특별시":[116,108],
        "세종특별자치시":[239],
        "울산광역시":[152],
        "인천광역시":[201,102,112],
        "전라남도":[259,262,266,165,164,258,174,168,252,170,260,256,175,268,261,169],
        "전라북도":[192,251,140,247,243,254,244,248,146,245],
        "제주도":[185,189,187,188,265,184],
        "충청남도":[238,235,236,129,232,177],
        "충청북도":[226,221,131,135,127],
    }
    for (const key in REGION) {
        for (const iterator of REGION[key]) {
            if(CODE*1 == iterator) return key;
        }        
    }
    return "미분류";
}

