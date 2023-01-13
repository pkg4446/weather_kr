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
}

async function csv2json(FILE,NAME,YEAR) {
    const RAW_DATA  = await FS.data_csv("data/kosis",FILE+YEAR,true);    
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
                        OUTPUT:REGION[12]
                    },

                    "고랭지배추":{
                        SCALE:REGION[13],
                        OUTPUT:REGION[15]
                    },
                    "노지가을배추":{
                        SCALE:REGION[16],
                        OUTPUT:REGION[18]
                    },
                    "시설배추":{
                        SCALE:REGION[19],
                        OUTPUT:REGION[21]
                    },
                    "시금치":{
                        SCALE:REGION[22],
                        OUTPUT:REGION[23]
                    },
                    "노지시금치":{
                        SCALE:REGION[24],
                        OUTPUT:REGION[26]
                    },
                    "시설시금치":{
                        SCALE:REGION[27],
                        OUTPUT:REGION[29]
                    },                
                    "상추":{
                        SCALE:REGION[30],
                        OUTPUT:REGION[31]
                    },                
                    "노지상추":{
                        SCALE:REGION[32],
                        OUTPUT:REGION[34]
                    },                
                    "시설상추":{
                        SCALE:REGION[35],
                        OUTPUT:REGION[37]
                    },
                    "양배추":{
                        SCALE:REGION[38],
                        OUTPUT:REGION[40]
                    }
                };
            }
        }               
    }
    delete DATA_SET["시도별"];
    delete DATA_SET["계"];
    const RESPONSE = FS.fileMK_JSON("data/save/farm",DATA_SET,NAME+YEAR);
    return RESPONSE;
}   

/* ////json Data set 
[
  '"시도별"',             '엽채류:면적 (ha)',
  '생산량 (톤)',          '배추:면적 (ha)',
  '생산량 (톤)', 4         '노지배추:면적 (ha)',
  '10a당 생산량 (kg)',    '생산량 (톤)',7

  '노지봄배추:면적 (ha)', '10a당 생산량 (kg)',
  '생산량 (톤)',    10      '일반봄배추:면적 (ha)',
  '10a당 생산량 (kg)',    '생산량 (톤)',12
  
  '고랭지배추:면적 (ha)', '10a당 생산량 (kg)',
  '생산량 (톤)',          '노지가을배추:면적 (ha)',16
  '10a당 생산량 (kg)',    '생산량 (톤)',18
  
  '시설배추:면적 (ha)',   '10a당 생산량 (kg)',
  '생산량 (톤)',          '시금치:면적 (ha)',22

  '생산량 (톤)',          '노지시금치:면적 (ha)',
  '10a당 생산량 (kg)',    '생산량 (톤)',26

  '시설시금치:면적 (ha)', '10a당 생산량 (kg)',
  '생산량 (톤)',          '상추:면적 (ha)',30

  '생산량 (톤)',          '노지상추:면적 (ha)',32
  '10a당 생산량 (kg)',    '생산량 (톤)',34
  '시설상추:면적 (ha)',   '10a당 생산량 (kg)',
  '생산량 (톤)',          '양배추:면적 (ha)',
  '10a당 생산량 (kg)',    '생산량 (톤)'
]
*/