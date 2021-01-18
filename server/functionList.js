const Tables = require('./Tables.json');
const sql = require('mssql');
const config = require('./config.js');
//輸出WhereString
function getWhereJoinString(joinCode, wheres, tables) {
    let wheres_ary = [];
    Object.keys(wheres).forEach(where => {
        switch (wheres[where].relation) {
            case "=":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} = '${wheres[where]}' `);
                break;
            case "like":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} like '%${wheres[where]}%' `);
                break;
            case "<>":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} <> '${wheres[where]}' `);
                break;
            case ">":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} > '${wheres[where]}' `);
                break;
            case ">=":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} >= '${wheres[where]}' `);
                break;
            case "<":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} < '${wheres[where]}' `);
                break;
            case "<=":
                wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} <= '${wheres[where]}' `);
                break;
        }
    });
    return wheres_ary.join('and ');
}

function getUnDeleteJoinString(joinCode, tables) {
    let result_ary = [];
    tables.forEach(table => {
        result_ary.push(`${joinCode[table].code}.del_flag = 'N' `);
    });
    return result_ary.join('and ');
}

//輸出ColumnsString
function getColumnsJoinString(joinCode, columns, tables) {
    let columns_ary = [];
    columns.forEach(column => {
        columns_ary.push(getTableFromColumn(column, tables, joinCode));
    });
    return columns_ary.join(', ');
}

//輸出欄位所屬表格
function getTableFromColumn(ColumnName, tables, joinCode) {
    let tableName = ``;
    let count = 0;
    while (tableName == `` && count < tables.length) {
        let temp = Tables[tables[count]].Columns.filter(x => x == ColumnName);
        if (temp.length == 1) tableName = tables[count];
        count++;
    }
    return `${joinCode[tableName].code}.${ColumnName}`;
}

//輸出patch欄位對應表格
function patchTablesFromColumn(ColumnName, tables) {
    let tablesName = [];
    tables.forEach(x => {
        let columns = new Set(Tables[x].Columns);
        if (columns.has(ColumnName)) tablesName.push(x);
    });
    return tablesName;
}
function inputText(index) {
    let temp = ['A', 'A', 'A'];
    let count = 2;
    do {
        temp[count] = String.fromCharCode(temp[count].charCodeAt(0) + index % 26);
        index = parseInt(index / 26);
        count--;
    } while (index > 0);
    return temp.join('');
}
//輸出post新增字串
function postInsertString(obj, columnValues) {
    if (!columnValues) columnValues = [];
    let keyValue;
    let keyName;
    let fatherKeyName;
    let data = [];
    let tableName = ``;
    Object.keys(obj).forEach(name => {
        if (typeof obj[name] == `object`) {
            tableName = name;
            data = obj[name];
            keyName = Tables[tableName].Key;
        } else {
            fatherKeyName = name;
            keyValue = obj[name];
        }
    });
    if (!fatherKeyName || fatherKeyName == 'undefined') {
        Object.keys(Tables).forEach(item => {
            if (Tables[item].ForeignTables.filter(x => x == tableName).length == 1) {
                fatherKeyName = Tables[item].Key;
            }
        });
    }
    let insert_str = ``;
    data.forEach((row, index) => {
        let key = `(select top 1 ${keyName} from ${tableName} order by ${keyName} DESC) `;
        let subInsert = [];
        let temp = { columns: [], values: [] };
        if (keyValue) {
            temp.columns.push(fatherKeyName);
            temp.values.push(keyValue);
        }
        Object.keys(row).forEach((item, index) => {
            if (typeof row[item] == 'string') {
                let columnKey = inputText(columnValues.length);
                columnValues.push({
                    columnKey: columnKey,
                    columnValue: row[item]
                });
                temp.columns.push(item);
                temp.values.push(`@${columnKey}`);
            } else {
                let s = postInsertString(JSON.parse(`{"${item}":${JSON.stringify(row[item])},"${keyName}":"${key}"}`), columnValues);
                subInsert.push(s.insert_str);
                columnValues = s.columnValues;
            }
        });
        insert_str += `insert into ${tableName} (${temp.columns.join(', ')}) values (${temp.values.join(', ')}) `;
        insert_str += subInsert.join(' ');
    });
    return { insert_str: insert_str, columnValues: columnValues };
}

//輸出patch更新字串
function patchUpdateString(obj, delObj, columnValues) {//data_obj, where_obj, update_ary, tables, data, wheres
    if (!columnValues) columnValues = [];
    let keyValue;
    let keyName;
    let fatherKeyName;
    let data = [];
    let tableName = ``;
    let thisKey;
    Object.keys(obj).forEach(name => {
        if (typeof obj[name] == `object`) {
            tableName = name;
            data = obj[name];
            keyName = Tables[tableName].Key;
        } else {
            fatherKeyName = name;
            keyValue = obj[name];
        }
    });
    if (!fatherKeyName || fatherKeyName == 'undefined') {
        Object.keys(Tables).forEach(item => {
            if (Tables[item].ForeignTables.filter(x => x == tableName).length == 1) {
                fatherKeyName = Tables[item].Key;
            }
        });
    }
    let update_str = ``;
    data.forEach((row, index) => {
        let thisKey = row[Tables[tableName].Key];
        let key = `(select top 1 ${keyName} from ${tableName} order by ${keyName} DESC) `;
        let subUpdate = [];
        let temp = { columns: [], values: [] };
        if (keyValue) {
            temp.columns.push(fatherKeyName);
            temp.values.push(keyValue);
        }
        Object.keys(row).forEach((item, index) => {
            // console.log(typeof row[item]);
            if (typeof row[item] == 'string') {
                let columnKey = inputText(columnValues.length);
                columnValues.push({
                    columnKey: columnKey,
                    columnValue: row[item]
                });
                temp.columns.push(item);
                temp.values.push(`@${columnKey}`);
            } else {
                if (thisKey) {
                    key = JSON.parse(JSON.stringify(thisKey));
                    let columnKey = inputText(columnValues.length);
                    columnValues.push({
                        columnKey: columnKey,
                        columnValue: JSON.parse(JSON.stringify(key))
                    });
                    key = `@${JSON.parse(JSON.stringify(columnKey))}`;
                }
                let s = patchUpdateString(JSON.parse(`{"${item}":${JSON.stringify(row[item])},"${keyName}":"${key}"}`), delObj, columnValues);
                subUpdate.push(s.update_str);
                columnValues = s.columnValues;
                delObj = s.delObj;
            }
        });
        if (thisKey) {
            delete delObj[`${tableName}:${thisKey}`];
            key = JSON.parse(JSON.stringify(thisKey));
            let columnKey = inputText(columnValues.length);
            columnValues.push({
                columnKey: columnKey,
                columnValue: key
            });
            let updateTemp_ary = [];
            update_str += `update ${tableName} set `;
            temp.columns.forEach((item, index) => {
                if (item != fatherKeyName)
                    updateTemp_ary.push(`${temp.columns[index]} = ${temp.values[index]} `);
            });
            update_str += `${updateTemp_ary.join(', ')} where ${keyName} = @${columnKey} `;
        } else if (thisKey == 0) {
            update_str += `insert into ${tableName} (${temp.columns.join(', ')}) values (${temp.values.join(', ')}) `;
        }
        update_str += subUpdate.join(' ');
    });
    return { update_str: update_str, columnValues: columnValues, delObj: delObj };
}
//帶修正
async function lockUpdateString(tableName, id, obj) {
    // return new Promise((firstResolve, firstReject) => {
    if (!obj) obj = {};
    obj[`${tableName}:${id}`] = `update ${tableName} set del_flag = 'Y' where ${Tables[tableName].Key} = '${id}' `;
    let foreignTables = JSON.parse(JSON.stringify(Tables[tableName].ForeignTables));
    async function tables(foreignTable) {
        let query_str = `select ${Tables[foreignTable].Key} from ${foreignTable} where ${Tables[tableName].Key} = '${id}' and del_flag = 'N' `;
        sql.connect(config, async function (connectERR) {
            if (connectERR) console.log(connectERR);
            let request = new sql.Request();
            request.query(query_str, async function (queryERR, recordset) {

            });
        });
    }
    while (foreignTables.length) {
        let foreignTable = foreignTables.shift();

    }





    for (let i = 0, second = Promise.resolve(); i < foreignTables.length; i++) {
        const foreignTable = foreignTables[i];
        let query_str = `select ${Tables[foreignTable].Key} from ${foreignTable} where ${Tables[tableName].Key} = '${id}' and del_flag = 'N' `;
        second = second.then(_ => new Promise(secondResolve => {
            sql.connect(config, async function (connectERR) {
                if (connectERR) console.log(connectERR);
                let request = new sql.Request();
                request.query(query_str, async function (queryERR, recordset) {
                    if (queryERR) console.log(queryERR);
                    for (let j = 0, therd = Promise.resolve(); j < recordset.recordset.length; j++) {
                        const item = recordset.recordset[j];
                        therd = therd.then(__ => new Promise(therdReslove => {
                            therdReslove();
                        }))
                    }
                });
            });
        }))
    }
    // firstResolve(obj);
    // });
}

//輸出put更新字串
function putUpdateString(data_obj, where_obj, update_ary, tables, data, wheres) {
    Object.keys(data).forEach(x => {
        patchTablesFromColumn(x, tables).forEach(y => {
            data_obj[y][x] = data[x];
        });
    });
    Object.keys(wheres).forEach(x => {
        patchTablesFromColumn(x, tables).forEach(y => {
            where_obj[y][x] = wheres[x];
        });
    });
    Object.keys(data_obj).forEach(x => {
        let data_ary = [];
        let where_ary = [];
        Object.keys(data_obj[x]).forEach(y => {
            data_ary.push(`${y} = @${y} `);
        });
        Object.keys(where_obj[x]).forEach(y => {
            where_ary.push(`${y} = @${y} `);
        });
        update_ary.push(`update ${x} set ${data_ary.join(', ')} where ${where_ary.join('and ')} `);
    });
    return update_ary.join(' ');
}

//輸出各種表格排列
function allRotated(list) {
    function rotatedTo(i) {
        var rotated = [];
        rotated.push(list[i]);
        return rotated.concat(list.slice(0, i))
            .concat(list.slice(i + 1, list.length));
    }

    var all = [];
    for (var i = 0; i < list.length; i++) {
        all.push(rotatedTo(i));
    }
    return all;
}

function tablesP(tables) {
    var pls = [];
    if (tables.length == 0) {
        pls.push([]);
    } else {
        allRotated(tables).forEach(function (lt) {
            tablesP(lt.slice(1, lt.length)).forEach(function (tailPl) {
                var pl = [];
                pl.push(lt[0]);
                pls.push(pl.concat(tailPl));
            });
        });
    }
    return pls;
}

//輸出join字串
function getJoinString(joinCode) {
    let join = ``;
    Object.keys(joinCode).forEach(item => {
        join += `left join ${item} ${joinCode[item].code} `;
        if (joinCode[item].from)
            join += `on ${joinCode[joinCode[item].from].code}.${Tables[joinCode[item].from].Key} = ${joinCode[item].code}.${Tables[joinCode[item].from].Key} `;
    });
    return `from ${join.substr(10)}`;
}

//輸出join代碼
function getJoinCode(tableName, tables) {
    let temp = new Set();
    tables.forEach(x => {
        temp.add(x);
    });
    let count = 65;
    let temp_count = 1;
    let obj = {};
    obj[tableName] = { code: String.fromCharCode(count) };
    temp.delete(tableName);
    count++;
    let compute_ary = JSON.parse(JSON.stringify(Tables[tableName].ForeignTables));
    let from_str = tableName;
    while (temp.size > 0) {
        // console.log(obj, tables, temp, compute_ary);
        if (compute_ary.length) {
            let n = compute_ary.shift();
            obj[n] = { code: String.fromCharCode(count), from: from_str };
            temp.delete(n);
            count++;
        }

        while (compute_ary.length == 0 && temp_count < Object.keys(obj).length) {
            compute_ary = JSON.parse(JSON.stringify(Tables[Object.keys(obj)[temp_count]].ForeignTables));
            from_str = Object.keys(obj)[temp_count];
            temp_count++;
        }
    }
    return obj;
}

//輸出完整表格清單
function getTables(tableName) {
    let tableList = Array.from(getTotalTable(tableName)).filter(x => x != tableName);
    let tableList_temp = tableList;
    tableList = computeTables(tableList, -1);
    tableList.push(tableList_temp);
    tableList = removeNotForeign(tableName, tableList);
    return tableList;
}

//輸出所有子表
function getTotalTable(tableName) {
    let runWhile = false;
    let tableList = new Set();
    tableList.add(tableName);
    do {
        runWhile = false;
        tableList.forEach(item => {
            Tables[item].ForeignTables.forEach(x => {
                if (!tableList.has(x)) {
                    runWhile = true;
                    tableList.add(x);
                }
            })
        })
    } while (runWhile)
    return tableList;
}

//輸出組合陣列
function computeTables(array, lastIndex) {
    let result = [];
    for (let i = lastIndex + 1; i < array.length; i++) {
        let temp = JSON.parse(JSON.stringify(array));
        temp.splice(i, 1);
        result.push(temp);
        if (temp.length > 0) {
            computeTables(temp, i - 1).forEach(x => {
                if (x.length > 0)
                    result.push(x);
            })
        }
    }
    return result;
}

//移除不符合表格
function removeNotForeign(tableName, tableList) {
    let temp = [];
    tableList.forEach(tables => {
        let removeList = new Set();

        tables.forEach(table => {
            removeList.add(table);
        });

        Tables[tableName].ForeignTables.forEach(foreign => {
            if (removeList.has(foreign)) removeList.delete(foreign);
        });
        tables.forEach(table => {
            Tables[table].ForeignTables.forEach(foreign => {
                if (removeList.has(foreign)) removeList.delete(foreign);
            });
        });
        let result = tables.filter(x => !removeList.has(x));
        temp.push(JSON.stringify(result.sort()));
    });
    let rmv = new Set();
    let return_ary = temp.filter(x => rmv.has(x) ? false : rmv.add(x));
    temp = [];
    return_ary.forEach(x => {
        let tables = JSON.parse(x);
        tables.push(tableName);
        temp.push(tables);
    });
    return temp;
}

function combineResultObject(query_ary, tableName, keyName, key) {
    let result = [];
    let rows = query_ary[tableName].data;
    rows.filter(row => row[keyName] == key).forEach(item => {
        let subTables = Tables[tableName].ForeignTables;
        subTables.forEach(subTable => {
            item[subTable] = combineResultObject(query_ary, subTable, Tables[tableName].Key, item[subTable, Tables[tableName].Key]);
        });
        result.push(item);
    });
    return result;
}

async function getQuery(query_str) {
    const promise = new Promise((resolve, reject) => {
        sql.connect(config, function (connectERR) {
            if (connectERR) console.log(connectERR);
            //create Request object
            var request = new sql.Request();
            request.query(query_str, function (queryERR, recordset) {
                if (queryERR) console.log(queryERR);
                let temp = recordset.recordset;
                temp = temp.filter(row => {
                    let delCheck = true;
                    Object.keys(row).forEach(item => {
                        delCheck = delCheck && row[item] == null;
                    });
                    return !delCheck;
                });
                resolve(temp);
            });
        });
    });
    return promise;
}

function getSubTables(tableName) {
    let obj = {}
    let subTables = Tables[tableName].ForeignTables;
    subTables.forEach(x => {
        obj[x] = getSubTables(x);
    });
    return obj;
}

module.exports = {
    getWhereJoinString: getWhereJoinString,
    getTables: getTables,
    getJoinCode: getJoinCode,
    getJoinString: getJoinString,
    tablesP: tablesP,
    getColumnsJoinString: getColumnsJoinString,
    postInsertString: postInsertString,
    patchUpdateString: patchUpdateString,
    putUpdateString: putUpdateString,
    combineResultObject: combineResultObject,
    getQuery: getQuery,
    getSubTables: getSubTables,
    lockUpdateString: lockUpdateString,
    getUnDeleteJoinString: getUnDeleteJoinString
}