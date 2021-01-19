const Tables = require('./Tables.json');
const sql = require('mssql');
const config = require('./config.js');
function main() {

}
//select*from INFORMATION_SCHEMA.Columns where TABLE_CATALOG = 'Father'
async function getAllColumnsFromDatabase() {
    return new Promise(resolve => {
        sql.connect(config, function (connectErr) {
            if (connectErr) console.log(connectErr);
            let request = new sql.Request();
            let query_str = `select TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE, DATA_TYPE,  from `
        })
    })
}