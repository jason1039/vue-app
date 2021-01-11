const Tables = require('./Tables.json');
//輸出WhereString
// function getWhereJoinString(joinCode, wheres, tables) {
//     let wheres_ary = [];
//     Object.keys(wheres).forEach(where => {
//         wheres_ary.push(`${getTableFromColumn(where, tables, joinCode)} = '${wheres[where]}' `);
//     });
//     return wheres_ary.join('and ');
// }

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

//輸出post欄位對應表格
function postTableFromColumn(ColumnName, tables) {
    let tableName = ``;
    let count = 0;
    while (tableName == `` && count < tables.length) {
        let temp = Tables[tables[count]].Columns.filter(x => x == ColumnName);
        if (temp.length == 1) tableName = tables[count];
        count++;
    }
    return tableName;
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

//輸出post新增字串
function postInsertString(insert_obj, tablesSet, data, tables) {
    let runWhile = false;
    let insert_ary = [];
    let key = {};
    Object.keys(data).forEach(x => {
        insert_obj[postTableFromColumn(x, tables)][x] = data[x];
    });
    do {
        runWhile = false;
        let mainTable = getMainTable(Array.from(tablesSet));

        let columns = [];
        let columnsValue = [];
        let keyTemp = [];
        Object.keys(insert_obj[mainTable]).forEach(x => {
            columns.push(x);
            columnsValue.push(`@${x}`);
            keyTemp.push(`${x} = @${x} `);
        });
        if (key[mainTable]) {
            columns.push(key[mainTable].key);
            columnsValue.push(key[mainTable].keyValue);
        }
        Tables[mainTable].ForeignTables.forEach(x => {
            key[x] = {
                keyValue: `(select top 1 ${Tables[mainTable].Key} from ${mainTable} where ${keyTemp.join('and ')} order by ${Tables[mainTable].Key} DESC)`,
                key: Tables[mainTable].Key
            }
        });

        insert_ary.push(`insert into ${mainTable} (${columns.join(', ')}) values (${columnsValue.join(', ')})`);
        tablesSet.delete(mainTable);
        if (tablesSet.size) runWhile = true;
    } while (runWhile);
    return insert_ary.join(' ');
}

//輸出patch更新字串
function patchUpdateString(data_obj, where_obj, update_ary, tables, data, wheres) {
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

//取得主要表格
function getMainTable(tables) {
    let runWhile = false;
    let mainTable = tables[0];
    do {
        runWhile = false;
        tables.forEach(table => {
            if (Tables[table].ForeignTables.filter(x => x == mainTable).length == 1) {
                mainTable = table;
                runWhile = true;
            }
        });
    }
    while (runWhile);
    return mainTable;
}

module.exports = {
    getTables: getTables,
    getJoinCode: getJoinCode,
    getJoinString: getJoinString,
    tablesP: tablesP,
    getColumnsJoinString: getColumnsJoinString,
    postInsertString: postInsertString,
    patchUpdateString: patchUpdateString,
    putUpdateString: putUpdateString
}