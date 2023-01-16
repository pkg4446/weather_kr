const FS = require("./fs_core");

module.exports = {
    to_json:    async function(FILE,NAME,YEAR){
        try {       
            const RES   = await csv2json(FILE,NAME,YEAR);       
            return RES;
        } catch (error) {    
            return false;
        }
    },

    split:    async function(FILE,YEAR){
        try {       
            const RES   = await split_type(FILE,YEAR);
            return RES;
        } catch (error) {    
            return false;
        }
    },
}

async function csv2json(FILE,NAME,YEAR) { 
    const RAW_DATA  = await FS.data_csv("data/kosis",FILE+NAME+YEAR,true);
    let   DATA_SET;
    switch (NAME) {
        case "엽채류_":
            DATA_SET = LEAF(RAW_DATA);
            break;
        case "근채류_":
            DATA_SET = ROOT(RAW_DATA);
            break;
        case "조미채소_":
            DATA_SET = SPICE(RAW_DATA);
            break;
    }
    delete DATA_SET["시도별"];
    delete DATA_SET["계"];
    const RESPONSE = FS.fileMK_JSON("data/save/farm",DATA_SET,NAME+YEAR);
    return RESPONSE;
}

async function split_type(FILE,YEAR) { 
    const RAW_DATA  = await FS.data_json("data/save/farm",FILE+YEAR,true);
    const DATA_SET  = {};
    for (const REGION in RAW_DATA) {
        for (const SPICE in RAW_DATA[REGION]) {
            if(DATA_SET[SPICE] == undefined) DATA_SET[SPICE] = {};
            if(DATA_SET[SPICE][REGION] == undefined) DATA_SET[SPICE][REGION] = {SCALE:0,OUTPUT:0};
            DATA_SET[SPICE][REGION].SCALE   += RAW_DATA[REGION][SPICE].SCALE;
            DATA_SET[SPICE][REGION].OUTPUT  += RAW_DATA[REGION][SPICE].OUTPUT;
        }
    }

    let RESPONSE = false;

    switch (FILE) {
        case "근채류_":
            RESPONSE = merge_ROOT(DATA_SET,YEAR);
            break;
        case "엽채류_":
            RESPONSE = merge_LEAF(DATA_SET,YEAR);
            break;
        case "조미채소_":
            RESPONSE = merge_SPICE(DATA_SET,YEAR);
            break;
    }
    return RESPONSE;
}

function merge_ROOT(RAW_DATA,YEAR) {    
    const DATA_SET  = {
        "무":{
            OPEN:{},
            GREEN:{}
            },
        "당근":{
            OPEN:{},
            GREEN:{}
        }
    };
    for (const TYPE in RAW_DATA) {
        if(TYPE == "시설무" || TYPE == "당근"){
            if(TYPE == "시설무"){
                for (const REGION in RAW_DATA[TYPE]) {
                    if(DATA_SET["무"][REGION] == undefined) DATA_SET["무"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                    DATA_SET["무"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                    DATA_SET["무"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
                }
            }else{     
                for (const REGION in RAW_DATA[TYPE]) {
                    if(DATA_SET["당근"][REGION] == undefined) DATA_SET["당근"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                    DATA_SET["당근"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                    DATA_SET["당근"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
                }           
            }
        }else{
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["무"][REGION] == undefined) DATA_SET["무"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["무"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["무"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }
    }
    let RESPONSE = false;
    for (const key in DATA_SET) {
        RESPONSE = FS.fileMK_JSON("data/processing/farm_type",DATA_SET[key],YEAR+"_"+key);
    }    
    return RESPONSE;
}

function merge_LEAF(RAW_DATA,YEAR) {    
    const DATA_SET  = {
        "배추":{
            OPEN:{},
            GREEN:{}
            },
        "시금치":{
            OPEN:{},
            GREEN:{}
        },
        "상추":{
            OPEN:{},
            GREEN:{}
        },
        "양배추":{
            OPEN:{},
            GREEN:{}
        }
    };
    for (const TYPE in RAW_DATA) {
        if(TYPE == "배추" || TYPE == "노지배추" || TYPE == "노지봄배추" || TYPE == "일반봄배추" || TYPE == "고랭지배추" || TYPE == "노지가을배추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["배추"][REGION] == undefined) DATA_SET["배추"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["배추"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["배추"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시설배추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["배추"][REGION] == undefined) DATA_SET["배추"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["배추"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["배추"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시금치" || TYPE == "노지시금치"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["시금치"][REGION] == undefined) DATA_SET["시금치"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["시금치"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["시금치"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시설시금치"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["시금치"][REGION] == undefined) DATA_SET["시금치"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["시금치"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["시금치"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "상추" || TYPE == "노지상추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["상추"][REGION] == undefined) DATA_SET["상추"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["상추"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["상추"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시설상추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["상추"][REGION] == undefined) DATA_SET["상추"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["상추"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["상추"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "양배추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["양배추"][REGION] == undefined) DATA_SET["양배추"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["양배추"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["양배추"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }  
        }else{
            console("알 수 없는 엽채류!!!");
        }
    }
    let RESPONSE = false;
    for (const key in DATA_SET) {
        RESPONSE = FS.fileMK_JSON("data/processing/farm_type",DATA_SET[key],YEAR+"_"+key);
    }
    return RESPONSE;
}

function merge_SPICE(RAW_DATA,YEAR) {
    const DATA_SET  = {
        "고추":{
            OPEN:{},
            GREEN:{}
            },
        "건고추":{
            OPEN:{},
            GREEN:{}
            },
        "파":{
            OPEN:{},
            GREEN:{}
        },
        "대파":{
            OPEN:{},
            GREEN:{}
        },
        "쪽파":{
            OPEN:{},
            GREEN:{}
        },
        "양파":{
            OPEN:{},
            GREEN:{}
        },
        "생강":{
            OPEN:{},
            GREEN:{}
        },
        "마늘":{
            OPEN:{},
            GREEN:{}
        }
    };
    for (const TYPE in RAW_DATA) {
        if(TYPE == "고추" || TYPE == "풋고추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["고추"][REGION] == undefined) DATA_SET["고추"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["고추"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["고추"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "파" || TYPE == "노지파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["파"][REGION] == undefined) DATA_SET["파"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["파"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["파"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시설파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["파"][REGION] == undefined) DATA_SET["파"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["파"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["파"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "대파" || TYPE == "노지대파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["대파"][REGION] == undefined) DATA_SET["대파"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["대파"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["대파"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시설대파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["대파"][REGION] == undefined) DATA_SET["대파"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["대파"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["대파"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "쪽파" || TYPE == "노지쪽파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["쪽파"][REGION] == undefined) DATA_SET["쪽파"].GREEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["쪽파"].GREEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["쪽파"].GREEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "시설쪽파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["쪽파"][REGION] == undefined) DATA_SET["쪽파"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["쪽파"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["쪽파"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else if(TYPE == "건고추"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["건고추"][REGION] == undefined) DATA_SET["건고추"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["건고추"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["건고추"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }  
        }else if(TYPE == "양파"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["양파"][REGION] == undefined) DATA_SET["양파"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["양파"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["양파"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }  
        }else if(TYPE == "생강"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["생강"][REGION] == undefined) DATA_SET["생강"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["생강"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["생강"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }  
        }else if(TYPE == "마늘"){
            for (const REGION in RAW_DATA[TYPE]) {
                if(DATA_SET["마늘"][REGION] == undefined) DATA_SET["마늘"].OPEN[REGION] = {SCALE:0,OUTPUT:0}
                DATA_SET["마늘"].OPEN[REGION].SCALE += RAW_DATA[TYPE][REGION].SCALE*1;
                DATA_SET["마늘"].OPEN[REGION].OUTPUT += RAW_DATA[TYPE][REGION].OUTPUT*1;
            }
        }else{
            console("알 수 없는 조미채소!!!");
        }
    }    
    let RESPONSE = false;
    for (const key in DATA_SET) {
        RESPONSE = FS.fileMK_JSON("data/processing/farm_type",DATA_SET[key],YEAR+"_"+key);
    }
    return RESPONSE;
}

function SPICE(RAW_DATA) {
    const DATA_SET  = {};
    for (const REGION of RAW_DATA) {
        if(DATA_SET[REGION[0]] == undefined){
            if(REGION[0]){
                DATA_SET[REGION[0]] = {
                    "고추":{
                        SCALE:REGION[3],
                        OUTPUT:REGION[4]
                    },
                    "건고추":{
                        SCALE:REGION[5],
                        OUTPUT:REGION[7]
                    },
                    "풋고추":{
                        SCALE:REGION[8],
                        OUTPUT:REGION[10]
                    },
                    "파":{
                        SCALE:REGION[11],
                        OUTPUT:REGION[12]
                    },
                    "노지파":{
                        SCALE:REGION[13],
                        OUTPUT:REGION[15]
                    }, 
                    "시설파":{
                        SCALE:REGION[16],
                        OUTPUT:REGION[18]
                    },

                    "대파":{
                        SCALE:REGION[19],
                        OUTPUT:REGION[21]
                    },
                    "노지대파":{
                        SCALE:REGION[22],
                        OUTPUT:REGION[24]
                    },
                    "시설대파":{
                        SCALE:REGION[25],
                        OUTPUT:REGION[27]
                    },
                    "쪽파":{
                        SCALE:REGION[28],
                        OUTPUT:REGION[30]
                    },
                    "노지쪽파":{
                        SCALE:REGION[31],
                        OUTPUT:REGION[33]
                    },
                    "시설쪽파":{
                        SCALE:REGION[34],
                        OUTPUT:REGION[36]
                    },
                    "양파":{
                        SCALE:REGION[37],
                        OUTPUT:REGION[39]
                    },
                    "생강":{
                        SCALE:REGION[40],
                        OUTPUT:REGION[42]
                    },
                    "마늘":{
                        SCALE:REGION[43],
                        OUTPUT:REGION[45]
                    }
                };
            }
        }               
    }
    return DATA_SET;
}

/*
[
  '"시도별"',          '조미채소:면적 (ha)', '생산량 (톤)',
  3'고추:면적 (ha)',    4'생산량 (톤)',        
  5'건고추:면적 (ha)',  '10a당 생산량 (kg)', 7'생산량 (톤)',        
  8'풋고추:면적 (ha)', '10a당 생산량 (kg)', 10'생산량 (톤)',        
  11'파:면적 (ha)',  12'생산량 (톤)',       
  13'노지파:면적 (ha)',   '10a당 생산량 (kg)',  15'생산량 (톤)',       
  16'시설파:면적 (ha)',   '10a당 생산량 (kg)',  18'생산량 (톤)', 

  19'대파:면적 (ha)',     '10a당 생산량 (kg)',  21'생산량 (톤)',       
  22'노지대파:면적 (ha)', '10a당 생산량 (kg)',  24'생산량 (톤)',       
  25'시설대파:면적 (ha)', '10a당 생산량 (kg)',  27'생산량 (톤)',       
  28'쪽파:면적 (ha)',     '10a당 생산량 (kg)',  30'생산량 (톤)',       
  31'노지쪽파:면적 (ha)', '10a당 생산량 (kg)',  33'생산량 (톤)',       
  34'시설쪽파:면적 (ha)', '10a당 생산량 (kg)',  36'생산량 (톤)',       
  37'양파:면적 (ha)',     '10a당 생산량 (kg)',  39'생산량 (톤)',       
  40'생강:면적 (ha)',     '10a당 생산량 (kg)',  42'생산량 (톤)',       
  43'마늘:면적 (ha)',     '10a당 생산량 (kg)',  45'생산량 (톤)'
]
*/

function ROOT(RAW_DATA) {
    const DATA_SET  = {};
    for (const REGION of RAW_DATA) {
        if(DATA_SET[REGION[0]] == undefined){
            if(REGION[0]){
                DATA_SET[REGION[0]] = {
                    "무":{
                        SCALE:REGION[3],
                        OUTPUT:REGION[4]
                    },
                    "노지무":{
                        SCALE:REGION[5],
                        OUTPUT:REGION[7]
                    },
                    "노지봄무":{
                        SCALE:REGION[8],
                        OUTPUT:REGION[10]
                    },
                    "일반봄무":{
                        SCALE:REGION[11],
                        OUTPUT:REGION[13]
                    },
                    "고랭지무":{
                        SCALE:REGION[14],
                        OUTPUT:REGION[16]
                    },
                    "노지가을무":{
                        SCALE:REGION[17],
                        OUTPUT:REGION[19]
                    },
                    "가을일반무":{
                        SCALE:REGION[20],
                        OUTPUT:REGION[22]
                    },
                    "가을총각무":{
                        SCALE:REGION[23],
                        OUTPUT:REGION[25]
                    },
                    "시설무":{
                        SCALE:REGION[26],
                        OUTPUT:REGION[28]
                    },
                    "당근":{
                        SCALE:REGION[29],
                        OUTPUT:REGION[31]
                    }
                };
            }
        }               
    }
    return DATA_SET;
}

/*
[
  '"시도별"',             '근채류:면적 (ha)',
  '생산량 (톤)',          3'무:면적 (ha)',
  4'생산량 (톤)',         5 '노지무:면적 (ha)',
  '10a당 생산량 (kg)',    7'생산량 (톤)',
  8'노지봄무:면적 (ha)',   '10a당 생산량 (kg)',
  10'생산량 (톤)',          11'일반봄무:면적 (ha)',
  '10a당 생산량 (kg)',    13'생산량 (톤)',
  14'고랭지무:면적 (ha)',   '10a당 생산량 (kg)',
  16'생산량 (톤)',          17'노지가을무:면적 (ha)',
  '10a당 생산량 (kg)',    19'생산량 (톤)',

  20'가을일반무:면적 (ha)', '10a당 생산량 (kg)',
  22'생산량 (톤)',        23'가을총각무:면적 (ha)',
  '10a당 생산량 (kg)',    25'생산량 (톤)',
  26'시설무:면적 (ha)',     '10a당 생산량 (kg)',
  28'생산량 (톤)',          29'당근:면적 (ha)',
  '10a당 생산량 (kg)',    31'생산량 (톤)'
]
*/

function LEAF(RAW_DATA) {
    const DATA_SET  = {};
    for (const REGION of RAW_DATA) {
        if(DATA_SET[REGION[0]] == undefined){
            if(REGION[0]){
                DATA_SET[REGION[0]] = {
                    "배추":{
                        SCALE:REGION[3],
                        OUTPUT:REGION[4]
                    },
                    "노지배추":{
                        SCALE:REGION[5],
                        OUTPUT:REGION[7]
                    },
                    "노지봄배추":{
                        SCALE:REGION[8],
                        OUTPUT:REGION[10]
                    },
                    "일반봄배추":{
                        SCALE:REGION[11],
                        OUTPUT:REGION[13]
                    },
                    "고랭지배추":{
                        SCALE:REGION[14],
                        OUTPUT:REGION[16]
                    },
                    "노지가을배추":{
                        SCALE:REGION[17],
                        OUTPUT:REGION[19]
                    },
                    "시설배추":{
                        SCALE:REGION[20],
                        OUTPUT:REGION[22]
                    },
                    "시금치":{
                        SCALE:REGION[23],
                        OUTPUT:REGION[24]
                    },
                    "노지시금치":{
                        SCALE:REGION[25],
                        OUTPUT:REGION[27]
                    },
                    "시설시금치":{
                        SCALE:REGION[28],
                        OUTPUT:REGION[30]
                    },                
                    "상추":{
                        SCALE:REGION[31],
                        OUTPUT:REGION[32]
                    },                
                    "노지상추":{
                        SCALE:REGION[33],
                        OUTPUT:REGION[35]
                    },                
                    "시설상추":{
                        SCALE:REGION[36],
                        OUTPUT:REGION[38]
                    },
                    "양배추":{
                        SCALE:REGION[39],
                        OUTPUT:REGION[41]
                    }
                };
            }
        }               
    }
    return DATA_SET;
}

/* ////json Data set 
[
  '"시도별"',             '엽채류:면적 (ha)',
  '생산량 (톤)',          3'배추:면적 (ha)',
  1'생산량 (톤)',         5'노지배추:면적 (ha)',
  '10a당 생산량 (kg)',    7'생산량 (톤)',

  8'노지봄배추:면적 (ha)', '10a당 생산량 (kg)',
  10'생산량 (톤)',       11'일반봄배추:면적 (ha)',
  '10a당 생산량 (kg)',   13'생산량 (톤)',
  
  14'고랭지배추:면적 (ha)', '10a당 생산량 (kg)',
  16'생산량 (톤)',        17'노지가을배추:면적 (ha)',
  '10a당 생산량 (kg)',    19'생산량 (톤)',18
  
  20'시설배추:면적 (ha)',   '10a당 생산량 (kg)',
  22'생산량 (톤)',        23'시금치:면적 (ha)',

  24'생산량 (톤)',        25'노지시금치:면적 (ha)',
  '10a당 생산량 (kg)',    27'생산량 (톤)',26

  28'시설시금치:면적 (ha)', '10a당 생산량 (kg)',
  30'생산량 (톤)',        31'상추:면적 (ha)',

  32'생산량 (톤)',        33'노지상추:면적 (ha)',
  '10a당 생산량 (kg)',    35'생산량 (톤)',
  36'시설상추:면적 (ha)',   '10a당 생산량 (kg)',
  38'생산량 (톤)',        39'양배추:면적 (ha)',
  '10a당 생산량 (kg)',    41'생산량 (톤)'
]
*/