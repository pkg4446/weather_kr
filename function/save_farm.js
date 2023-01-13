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
}

async function csv2json(FILE) {
    const RAW_DATA  = await FS.data_csv("data/kosis",FILE);    
    const DATA_SET  = {};
    console.log(RAW_DATA);
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