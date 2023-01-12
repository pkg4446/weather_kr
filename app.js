const controller = require("./controller");

const RUN  = READ_FILE();

async function READ_FILE() {
    const RES = await controller.read(2000);
    console.log(RES["01"]);
}
