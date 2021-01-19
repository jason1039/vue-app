require('./ResetTables.js');
const createExcel = require('./excel/createExcel.js');
const bodyParser = require('body-parser');
const express = require('express');
const Tables = require('./Tables.json');
const { addGet, addPost, addPatch, addPut, addgetObj, addDelete, addRecovery } = require('./compute.js');
var app = express();
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});
app.get(`/test`, function (req, res) {
    res.status(200).send('TestCheck');
});
Object.keys(Tables).forEach(item => {
    //get
    addGet(app, item);
    addgetObj(app, item);
    //post
    addPost(app, item);
    //put
    addPut(app, item);
    //patch
    addPatch(app, item);
    //delete
    addDelete(app, item);
    //recovery
    addRecovery(app, item);

})
app.get(`/exceltest`, async function (req, res) {
    createExcel(res);
});
app.get(`/downloadtest`, function (req, res) {
    const file = `./src/assets/add.png`;
    res.download(file);
});

let port = 5050;
function runServer(port) {
    app.listen(port, function () {
        console.log(`Server is running on :http://localhost:${port}/ `);
    }).on('error', () => {
        port++;
        runServer(port)
    });
}
runServer(port);