const Excel = require('exceljs');
const fontClass = new Set(['size', 'family', 'bold', 'italics', 'underline', 'color']);
const alignmentClass = new Set(['align', 'vertical', 'shrinkToFit', 'wrapText']);
const fillClass = new Set(['bgColor']);
const excelTest = { "testWs1": [{ col: 1, row: 1, value: "真旺2020年09月庫存總表", style: { size: 16, family: "宋体", bold: true, bgColor: '#F9F900' }, merge: { col: 12, row: 1 }, height: 30 }, { col: 1, row: 2, value: "編號", style: { size: 10, name: 'Arial', bold: true }, width: 5, merge: { col: 1, row: 2 } }, { col: 2, row: 2, value: "原廠", style: { size: 10, name: 'Arial', bold: true }, width: 5, merge: { col: 1, row: 2 } }, { col: 3, row: 2, value: "品名", style: { size: 10, name: 'Arial', bold: true }, merge: { col: 1, row: 2 } }, { col: 4, row: 2, value: "規格", style: { size: 10, name: 'Arial', bold: true }, merge: { col: 1, row: 2 } }, { col: 5, row: 2, value: "上月庫存", style: { size: 10, name: 'Arial', bold: true }, width: 10, merge: { col: 1, row: 2 } }, { col: 6, row: 2, value: "上月金額", style: { size: 10, name: 'Arial', bold: true }, width: 10, merge: { col: 1, row: 2 } }, { col: 7, row: 2, value: `單價\rRMB`, style: { color: '#FF0000', size: 10, name: '宋体', bold: true }, width: 5, merge: { col: 1, row: 2 } }, { col: 8, row: 2, value: "含稅", style: { color: '#FF0000', size: 10, name: 'Arial', bold: true }, width: 3, merge: { col: 1, row: 2 } }, { col: 9, row: 2, value: "總庫存", style: { color: '#FF0000', size: 10, name: 'Arial', }, width: 7, merge: { col: 1, row: 2 } }, { col: 10, row: 2, value: "本月庫存金額", style: { size: 10, name: 'Arial', }, width: 7, merge: { col: 1, row: 2 } }, { col: 11, row: 2, value: "本月累計", style: { size: 12, name: 'Arial', }, width: 10, merge: { col: 2, row: 1 } }, { col: 11, row: 3, value: "進貨", style: { size: 10, name: 'Arial', }, width: 5, }, { col: 12, row: 3, value: "出貨", size: 10, name: 'Arial', width: 5, }], "testWs2": [] }

function main(res, excelObj) {
    // 建立標籤為紅色的表格
    //var sheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}});
    // 建立網格線隱藏的表格
    //var sheet = workbook.addWorksheet('My Sheet', {properties: {showGridLines: false}});
    // 建立第一行第一列凍結的表格
    //var sheet = workbook.addWorksheet('My Sheet', {views:[{xSplit: 1, ySplit:1}]});
    if (!excelObj) excelObj = excelTest;
    let workbook = new Excel.Workbook();
    let sheets = {};
    Object.keys(excelObj).forEach((sheetName, index) => {
        sheets[sheetName] = workbook.addWorksheet(sheetName);
        let worksheet = workbook.getWorksheet(index + 1);
        let thisSheet = excelObj[sheetName];
        thisSheet.forEach(cell => {
            worksheet.getRow(cell.row).getCell(cell.col).value = cell.value;
            worksheet.getRow(cell.row).getCell(cell.col).
            if (cell.merge ? cell.merge.col || cell.merge.row : false) {
                let mergeCol = cell.merge.col || 1;
                let mergeRow = cell.merge.row || 1;
                worksheet.mergeCells(cell.row, cell.col, cell.row + mergeRow - 1, cell.col + mergeCol - 1);
            }
        });
    })
    res.status(200);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=teststream.xlsx'
    );
    workbook.xlsx.write(res).then(() => {
        res.end();
    })
    // return new Promise(resolve => {
    //     if (!excelObj) excelObj = excelTest;
    //     let wookbook = new xl.Workbook();
    //     let sheets = {};
    //     Object.keys(excelObj).forEach((sheetName, index) => {
    //         let thisSheet = excelObj[sheetName];
    //         sheets[sheetName] = wookbook.addWorksheet(sheetName);
    //         let rowHeight = [];
    //         let columnWidth = [];
    //         thisSheet.forEach(cell => {
    //             let cellPosition = [cell.row, cell.col];
    //             if (cell.merge ? cell.merge.col || cell.merge.row : false) {
    //                 let mergeCol = cell.merge.col || 0;
    //                 let mergeRow = cell.merge.row || 0;
    //                 cellPosition = [cell.row, cell.col, cell.row + mergeRow - 1, cell.col + mergeCol - 1, true];
    //             }
    //             sheets[sheetName].cell(...cellPosition).string(cell.value.replace(/[\r\n]/g, String.fromCharCode(10))).style(createStyle(wookbook, cell.style));
    //             createStyle(wookbook, cell.style);
    //             if (cell.height) rowHeight[cell.row] = cell.height; else rowHeight[cell.row] = 15;
    //             if (cell.width) columnWidth[cell.col] = cell.width; else columnWidth[cell.row] = 12;
    //         });
    //         for (let i = 1; i < rowHeight.length; i++) {
    //             sheets[sheetName].row(i).setHeight(rowHeight[i] ? rowHeight[i] : 15);
    //         }
    //         for (let i = 1; i < columnWidth.length; i++) {
    //             sheets[sheetName].column(i).setWidth(columnWidth[i] ? columnWidth[i] : 12);
    //         }
    //     });
    //     wookbook.write('test', res);
    //     // wookbook.writeToBuffer().then((buffer) => {
    //     //     resolve(buffer);
    //     // });
    // });
}

function createStyle(wb, styleObj) {
    if (!styleObj) styleObj = {};
    let style = {
        alignment: {
            horizontal: 'center',
            vertical: 'center',
            shrinkToFit: true,
            wrapText: true
        },
        border: {
            //style
            //none, thin, medium, dashed, dotted, thick, double, hair, mediumDashed, dashDot, mediumDashDot, dashDotDot, mediumDashDotDot, slantDashDot
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
        }
    };
    Object.keys(styleObj).forEach(s => {
        if (fontClass.has(s)) {
            if (!style.font) style.font = {};
            let value = styleObj[s];
            switch (s) {
                case "family":
                    s = 'name';
                    break;
            }
            style.font[s] = value;
        }
        if (alignmentClass.has(s)) {
            //horizontal, vertical
            if (!style.alignment) style.alignment = {};
            let value = styleObj[s];
            switch (s) {
                case "align":
                    s = 'horizontal';
                    break;
            }
            style.alignment[s] = value;
        }
        if (fillClass.has(s)) {
            if (!style.fill) style.fill = {};
            style.fill = {
                type: 'pattern',
                patternType: 'solid',
                bgColor: styleObj[s],
                fgColor: styleObj[s],
            }
        }
    });
    return wb.createStyle(style);
}
module.exports = main;