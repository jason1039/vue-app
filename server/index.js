require('./Tables/ResetTables.js');
const exec = require('child_process').exec;
const createExcel = require('./excel/createExcel.js');
const bodyParser = require('body-parser');
const express = require('express');
const Tables = require('./Tables/Tables.json');
const { addGet, addPost, addPatch, addPut, addgetObj, addDelete, addRecovery } = require('./Tables/compute.js');
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
app.get(`/gitUpdate`, function (req, res) {
    res.status(200);
    exec('git pull',
        function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
});
let port = 5050;
function runServer(port) {
    app.listen(port, function () {
        console.log(`Server is running on :http://localhost:${port}/ `);
        exec(`npm run serve`, function () {
            console.log(`Vue is running`);
        });
    }).on('error', () => {
        port++;
        runServer(port)
    });
}
runServer(port);