const Tables = require('./Tables.json');
const sql = require('mssql');
const config = require('./config.js');
const { getWhereJoinString, getTables, getJoinCode, getJoinString, tablesP, getColumnsJoinString, postInsertString, patchUpdateString, putUpdateString, postForeignKey } = require('./functionList.js');
//新增get用法
function addAppGet(app, tableName) {
    let tableList = getTables(tableName);
    tableList.forEach(tables => {
        let joinCode = getJoinCode(tableName, tables);
        let from_str = getJoinString(joinCode);
        tablesP(tables).forEach(x => {
            app.get(`/${x.join('&')}`, function (req, res) {
                let columns = req.query.columns;
                let wheres = req.query.wheres;
                wheres.Del_Flag = 'N';
                let columns_str = getColumnsJoinString(joinCode, columns, tables);
                let wheres_str = getWhereJoinString(joinCode, wheres, tables);
                let query_str = `select ${columns_str} ${from_str} `;
                if (wheres_str) query_str += wheres;
                sql.connect(config, function (connectERR) {
                    if (connectERR) console.log(connectERR);
                    //create Request object
                    var request = new sql.Request();
                    request.query(query_str, function (queryERR, recordset) {
                        if (queryERR) res.send(queryERR);
                        res.send(recordset);
                    });
                });
            });
        });
    });
}

//新增post用法
function addAppPost(app, tableName) {
    app.post(`/${tableName}`, function (req, res) {
        let obj = postInsertString(req.body);
        console.log(obj);
        sql.connect(config, function (connectERR) {
            if (connectERR) console.log(connectERR);
            // create Request object
            var request = new sql.Request();
            obj.columnValues.forEach(x => {
                request.input(x.columnKey, x.columnValue);
            });
            request.query(obj.insert_str, function (queryERR, recordset) {
                if (queryERR) console.log(queryERR);
                res.send(recordset);
            });
        });
    });
    // let tableList = getTables(tableName);
    // tableList.forEach(tables => {
    //     let insert_obj = {};
    //     tables.forEach(item => {
    //         insert_obj[item] = {};
    //     });
    //     let tablesSet = new Set(tables);
    //     tablesP(tables).forEach(x => {
    //         app.post(`/${x.join('&')}`, function (req, res) {
    //             let insert_str = postInsertString(insert_obj, tablesSet, req.body.params.data, tables);
    //             sql.connect(config, function (connectERR) {
    //                 if (connectERR) console.log(connectERR);
    //                 //create Request object
    //                 var request = new sql.Request();
    //                 Object.keys(req.body.params.data).forEach(x => {
    //                     request.input(x, req.body.params.data[x]);
    //                 });
    //                 request.query(insert_str, function (queryERR, recordset) {
    //                     if (queryERR) console.log(queryERR);
    //                     res.send(recordset);
    //                 });
    //             });
    //         });
    //     });
    // });
}

//新增patch用法
function addAppPatch(app, tableName) {
    let tableList = getTables(tableName);
    tableList.forEach(tables => {
        let data_obj = {};
        let where_obj = {};
        tables.forEach(x => {
            data_obj[x] = {};
            where_obj[x] = {};
        });
        let update_ary = [];
        tablesP(tables).forEach(x => {
            app.patch(`/${x.join('&')}`, function (req, res) {
                let data = req.body.params.data;
                let wheres = req.body.params.wheres;
                wheres.Del_Flag = 'N';
                let update_str = patchUpdateString(data_obj, where_obj, update_ary, tables, data, wheres);
                sql.connect(config, function (connectERR) {
                    if (connectERR) console.log(connectERR);
                    //create Request object
                    var request = new sql.Request();
                    Object.keys(data).forEach(x => {
                        request.input(x, data[x]);
                    });
                    Object.keys(wheres).forEach(x => {
                        request.input(x, wheres[x]);
                    });
                    request.query(update_str, function (queryERR, recordset) {
                        if (queryERR) console.log(queryERR);
                        res.send(recordset);
                    });
                });
            });
        });
    });
}

//新增put用法
function addAppPut(app, tableName) {
    let tableList = getTables(tableName);
    tableList.forEach(tables => {
        let data_obj = {};
        let where_obj = {};
        tables.forEach(x => {
            let obj = {};
            let keys = new Set();
            Object.keys(Tables).forEach(y => {
                keys.add(Tables[y].Key);
            });
            Tables[x].Columns.filter(y => y != Tables[x].Key).forEach(y => {
                obj[y] = '';
            });
            data_obj[x] = obj;
            where_obj[x] = {};
            let update_ary = [];
            tablesP(tables).forEach(y => {
                app.put(`/${y.join('&')}`, function (req, res) {
                    let data = req.body.params.data;
                    let wheres = req.body.params.wheres;
                    wheres.Del_Flag = 'N';
                    let update_str = putUpdateString(data_obj, where_obj, update_ary, tables, data, wheres);
                    sql.connect(config, function (connectERR) {
                        if (connectERR) console.log(connectERR);
                        //create Request object
                        var request = new sql.Request();
                        let data_temp = {};
                        Object.keys(data_obj).forEach(i => {
                            Object.keys(data_obj[i]).forEach(j => {
                                data_temp[j] = data_obj[i][j];
                            });
                        });
                        keys.forEach(k => {
                            Object.keys(data_temp).forEach(item => {
                                if (item == k) delete data_temp[k];
                            });
                        });
                        Object.keys(data_temp).forEach(z => {
                            request.input(z, data_temp[z]);
                        });
                        Object.keys(wheres).forEach(z => {
                            request.input(z, wheres[z]);
                        });
                        request.query(update_str, function (queryERR, recordset) {
                            if (queryERR) console.log(queryERR);
                            res.send(recordset);
                        });
                    });
                });
            });
        });
    });
}







module.exports = {
    addGet: addAppGet,
    addPost: addAppPost,
    addPatch: addAppPatch,
    addPut: addAppPut
}