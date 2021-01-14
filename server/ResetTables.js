const fs = require('fs');

function main() {
    let tables = {};
    let folderPath = './SQL/Create';
    let files = getFiles(folderPath);
    let foreign_temp = [];
    files.forEach(x => {
        let fileContent = readFileContent(`${folderPath}/${x}`);
        let fileLine_ary = readFileLine(fileContent);
        fileLine_ary.forEach(y => {
            let tableName = getTableName(y);
            let columns = getColumns(y);
            let foreignTable = getForeignTable(columns);
            let primaryKey = getPrimaryKey(columns);
            let columnsName = getColumnName(columns);
            tables[tableName] = {};
            tables[tableName].Columns = columnsName;
            tables[tableName].Key = primaryKey;
            tables[tableName].ForeignTables = [];
            if (foreignTable)
                foreign_temp.push({
                    primaryTable: foreignTable,
                    foreignTable: tableName
                });
        });
    });
    foreign_temp.forEach(x => {
        tables[x.primaryTable].ForeignTables.push(x.foreignTable);
    });
    writeTables(tables);
}

function writeTables(tables) {
    fs.writeFileSync('./server/Tables.json', JSON.stringify(tables));
}

function getColumnName(columns) {
    let columns_ary = [];
    columns.forEach(element => {
        let columnName = element.trim().match(/^[a-z_]*/)[0];
        columns_ary.push(columnName);
    });
    return columns_ary;
}

function getForeignTable(columns) {
    let foreignTable;
    let temp = columns.filter(x =>
        x.indexOf('foreign key') > -1
    );
    if (temp.length) {
        foreignTable = temp[0].trim().match(/(references )([a-z]*)/)[2];
    }
    return foreignTable;
}

function getPrimaryKey(columns) {
    return columns.filter(x =>
        x.indexOf('primary key') > -1
    )[0].trim().match(/^[a-z]*/)[0];
}

function getTableName(fileLine) {
    let tableName = fileLine.match(/create table [^\(]*/g)[0];
    let temp_ary = tableName.split(' ');
    tableName = temp_ary[temp_ary.length - 1];
    tableName = tableName.toLowerCase();
    return tableName;
}

function getColumns(fileLine) {
    let columns = fileLine.match(/(\(.*[$\)])/g)[0];
    columns = columns.substr(1, columns.length - 2);
    columns = columns.toLowerCase();
    columns = columns.split(',');
    let result = [];
    columns.forEach((item, index) => {
        if (item.match(/^[0-9]/g)) {
            if (columns[index - 1].match(/[0-9]$/g)) {
                result[result.length - 1] = result[result.length - 1] + item;
                return;
            }
        }
        result.push(item);
    });
    return result;
}

function readFileLine(fileContent) {
    let fileLine_ary = fileContent.split('\n');
    return fileLine_ary;
}

function readFileContent(filePath) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
}

function getFiles(folerPath) {
    return fs.readdirSync(folerPath);
}


module.exports = main;