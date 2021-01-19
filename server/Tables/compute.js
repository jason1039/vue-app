const Tables = require('./Tables.json');
const sql = require('mssql');
const config = require('../config.js');
const { getWhereJoinString,
    getTables,
    getJoinCode,
    getJoinString,
    tablesP,
    getColumnsJoinString,
    postInsertString,
    patchUpdateString,
    putUpdateString,
    combineResultObject,
    getQuery,
    getSubTables,
    lockUpdateString,
    getUnDeleteJoinString,
    unLockUpdateString } = require('../functionList.js');
const { promises } = require('dns');
//新增get用法
function addAppGet(app, tableName) {
    let tableList = getTables(tableName);
    tableList.forEach(tables => {
        let joinCode = getJoinCode(tableName, tables);
        let from_str = getJoinString(joinCode);
        tablesP(tables).forEach(x => {
            app.get(`/${x.join('&')}`, function (req, res) {
                let columns = req.query.columns;
                let wheres = JSON.parse(JSON.stringify(req.query.wheres));
                let Undelete_str = getUnDeleteJoinString(joinCode, tables);
                let columns_str = getColumnsJoinString(joinCode, columns, tables);
                let wheres_str = getWhereJoinString(joinCode, wheres, tables);
                let query_str = `select ${columns_str} ${from_str} `;
                if (wheres_str) query_str += wheres + Undelete_str;
                else query_str += `where ${Undelete_str}`;
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

function addAppgetObj(app, tableName) {
    let obj = {};
    let result = {};
    obj[tableName] = getSubTables(tableName, obj);
    app.get(`/Object/${tableName}`, async function (req, res) {
        let id = req.query.id;
        let temp = [{
            tableList: [tableName]
        }];
        for (let i = 0; i < temp.length; i++) {
            let obj_temp = obj;
            temp[i].tableList.forEach(x => {
                obj_temp = obj_temp[x];
            });
            let old_ary = JSON.parse(JSON.stringify(temp[i].tableList));
            Object.keys(obj_temp).forEach(y => {
                let old_ary_temp = JSON.parse(JSON.stringify(old_ary));
                old_ary_temp.push(y);
                temp.push({
                    tableList: old_ary_temp
                });
            });
        }
        let query_ary = {};
        temp.forEach(x => {
            let name = x.tableList[x.tableList.length - 1];
            let mainCode = String.fromCharCode(65 + x.tableList.length - 1);
            let join = [];
            let key;
            let str = ``;
            let del_falg = [];
            x.tableList.forEach((y, index) => {
                let str = `${y} ${String.fromCharCode(65 + index)} `;
                if (key)
                    str += `on ${String.fromCharCode(65 + index - 1)}.${key} = ${String.fromCharCode(65 + index)}.${key} and ${String.fromCharCode(65 + index)}.del_flag = 'N' `;
                key = Tables[y].Key;
                join.push(str);
                del_falg.push(`${String.fromCharCode(65 + index)}.del_flag = 'N' `);
            });
            query_ary[name] = {
                query_str: `select ${mainCode}.* from ${join.join('left join ')}where A.${Tables[tableName].Key} = '${id}' `,
                father: x.tableList[x.tableList.length - 2],
                key: key
            };
        });
        for (let i = 0; i < Object.keys(query_ary).length; i++) {
            query_ary[Object.keys(query_ary)[i]].data = await getQuery(query_ary[Object.keys(query_ary)[i]].query_str);
        }
        let result = combineResultObject(query_ary, tableName, Tables[tableName].Key, id);
        res.send(result);
    });
}

//新增post用法
function addAppPost(app, tableName) {
    app.post(`/${tableName}`, function (req, res) {
        let obj = postInsertString(req.body);
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
}

//新增patch用法
function addAppPatch(app, tableName) {
    app.patch(`/${tableName}`, async function (req, res) {
        let delObj = await lockUpdateString(tableName, req.body[tableName][0][Tables[tableName].Key]);
        let obj = patchUpdateString(req.body, delObj);
        sql.connect(config, async function (connectERR) {
            if (connectERR) console.log(connectERR);
            // create Request object
            var request = new sql.Request();
            obj.columnValues.forEach(x => {
                request.input(x.columnKey, x.columnValue);
            });
            request.query(obj.update_str + Object.values(obj.delObj).join(' '), function (queryERR, recordset) {
                if (queryERR) console.log(queryERR);
                res.send(recordset);
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

function addAppDelete(app, tableName) {
    app.delete(`/${tableName}`, async function (req, res) {
        let id = req.query.id;
        let delObj = await lockUpdateString(tableName, id);
        sql.connect(config, function (connectERR) {
            if (connectERR) console.log(connectERR);
            var request = new sql.Request();
            request.query(Object.values(delObj).join(' '), function (queryERR, recordset) {
                if (queryERR) console.log(queryERR);
                res.send();
            });
        });
    })
}

function addAppRecovery(app, tableName) {
    app.delete(`Recovery/${tableName}`, async function (req, res) {
        let id = req.query.id;
        let delObj = await unLockUpdateString(tableName, id);
        sql.connect(config, function (connectERR) {
            if (connectERR) console.log(connectERR);
            var request = new sql.Request();
            request.query(Object.values(delObj).join(' '), function (queryERR, recordset) {
                if (queryERR) console.log(queryERR);
                res.send();
            });
        });
    })
}





module.exports = {
    addGet: addAppGet,
    addPost: addAppPost,
    addPatch: addAppPatch,
    addPut: addAppPut,
    addgetObj: addAppgetObj,
    addDelete: addAppDelete,
    addRecovery: addAppRecovery
}