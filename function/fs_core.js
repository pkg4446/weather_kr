const fs    = require('fs');

module.exports = {

    Dir:    async function(FOLDER){
        try {
            const PATH  = FOLDER + "/";
            const dir   = fs.readdirSync(PATH);
            return dir;
        } catch (error) {    
            return false;
        }
    },

    check:  function(FOLDER){
        const PATH  = FOLDER + "/";
        const CHECK = fs.existsSync(PATH, 'utf8')
        return CHECK;
    },

    move:   async function(TARGET,MOVE){
        try {
            fs.renameSync(TARGET, MOVE);
            return true;
        } catch (error) {    
            return false;
        }
    },

    folderDel:   function(FOLDER){
        const PATH  = FOLDER + "/";
        try {
            fs.rmSync(PATH, { recursive: true, force: true });
        } catch (error) {   
            console.error(`${FOLDER} 폴더가 삭제되었습니다.`);
        }
    },

    folderMK:    function(PATH){  
        if(!fs.existsSync(PATH, 'utf8'))fs.mkdirSync(PATH);
        return true;
    },

    fileMK_JSON:    function(FOLDER,DATA,FILE){        
        try {
            fs.writeFileSync(`${FOLDER}/${FILE}.json`, JSON.stringify(DATA));
        } catch (error) {
            return false;
        }
        return true;
    },

    fileMK_CSV:    function(FOLDER,DATA,FILE){        
        try {
            fs.writeFileSync(`${saveFolder+FOLDER}${FILE}.csv`, JSON.stringify(DATA) + ",\n");
        } catch (error) {
            return false;
        }
        return true;
    },

    fileMK:    function(FOLDER,DATA,FILE){        
        try {
            fs.writeFileSync(`${saveFolder+FOLDER}${FILE}`, DATA);
        } catch (error) {
            return false;
        }
        return true;
    },

    fileDel:    function(FOLDER,FILE){
        const PATH = FOLDER + "/";
        try {
            fs.readdirSync(PATH, 'utf8');
            try {
                fs.unlinkSync(PATH+FILE);
                return FILE;
            } catch (error) {
                return false;
            }            
        } catch (error) {   
            fs.mkdirSync(PATH);
            return false;
        }                
    },

    data_json:   async function(FOLDER,FILE){
        try {            
            const PATH = FOLDER + "/";
            const data      = fs.readFileSync(PATH + FILE + ".json", 'utf8');
            const response  = JSON.parse(data);
            return  response;
        } catch (error) {    
            return false;
        }
    },

    data_csv:   async function(FOLDER,FILE){
        try {
            const PATH = FOLDER + "/";
            const Data = fs.readFileSync(PATH + FILE + ".csv", 'utf8').split("\r\n");
            const response = [];
            for (let index = 0; index < Data.length; index++) {
                response.push(Data[index].split(","));                
            }
            return response;
        } catch (error) {    
            return false;
        }
    },
}