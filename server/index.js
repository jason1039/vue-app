const ResetTables = require('./ResetTables.js');
ResetTables();
const bodyParser = require('body-parser');
const express = require('express');
// const sqlMap = require('./apiMap.json');
const Tables = require('./Tables.json');
const { addGet, addPost, addPatch, addPut, addAppgetObj } = require('./compute.js');
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
    addAppgetObj(app, item);
    //post
    addPost(app, item);
    //put
    addPut(app, item);
    //patch
    addPatch(app, item);
    //lock

    //unlock

    //delete

})
// Object.keys(sqlMap).forEach(name => {
//     switch (sqlMap[name].type) {
//         case "get":
//             app.get(`/${name}`, function (req, res) {
//                 let filter_str = Object.values(req.query).join('and ');
//                 let query_str = sqlMap[name].sql;
//                 if (filter_str) query_str += ` where ${filter_str}`;
//                 //connect to your database
//                 sql.connect(config, function (connectERR) {
//                     if (connectERR) console.log(connectERR);
//                     //create Request object
//                     var request = new sql.Request();
//                     request.query(query_str, function (queryERR, recordset) {
//                         if (queryERR) console.log(queryERR);
//                         res.send(recordset);
//                     });
//                 });
//             });
//             break;
//         case "post":
//             app.post(`/${name}`, function (req, res) {
//                 let execute_str = sqlMap[name].sql;
//                 let columns = {};

//                 Object.keys(req.body.params).forEach(item => {
//                     if (sqlMap[name].columns.filter(x => x == item)) {
//                         columns[item] = `${req.body.params[item]}`;
//                     }
//                 })
//                 execute_str += `(${Object.keys(columns).toString()}) values(@${Object.keys(columns).join(',@')})`;
//                 //connect to your database
//                 sql.connect(config, function (connectERR) {
//                     if (connectERR) console.log(connectERR);
//                     //create Request object
//                     var request = new sql.Request();
//                     Object.keys(columns).forEach(item => {
//                         request.input(item, columns[item]);
//                     })
//                     request.query(execute_str, function (executeERR, recordset) {
//                         if (executeERR) res.status(400).send(executeERR);
//                         res.send(recordset);
//                     });
//                 });
//             });
//             break;
//     }

// })

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