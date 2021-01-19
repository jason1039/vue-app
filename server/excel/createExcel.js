//https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md
const tabColor = new Function('argb', 'return {argb:argb};');
const paperSize = new Function('num', 'const worksheetPaperSize = new Set([5, 7, 8, 9, 11, 13, 20, 27, 28, 34, 37, 82, 119]);if(worksheetPaperSize.has(num))return num; else return 9;');

const Excel = require('exceljs');
const workbookAttr = new Set([{ name: 'creator', type: String }, { name: 'lastModifiedBy', type: String }, { name: 'created', type: Date }, { name: 'modified', type: Date }, { name: 'lastPrinted', type: Date }])
const worksheetState = new Set(['visible', 'hidden', 'veryHidden']);
const worksheetAttr = new Set([{ name: 'tabColor', type: tabColor }, { name: 'outlineLevelCol', type: String }, { name: 'outlineLevelRow', type: Number }, { name: 'defaultRowHeight', type: Number }, { name: 'defaultColWidth', type: Number }, { name: 'dyDescent', type: String }, { name: 'rowCount', type: String }, { name: 'actualRowCount', type: String }, { name: 'columnCount', type: String }, { name: 'actualColumnCount', type: String }])
const worksheetPageSetup = new Set([{ name: 'margins', type: Object }, { name: 'orientation', type: String }, { name: 'horizontalDpi', type: BigInt }, { name: 'verticalDpi', type: BigInt }, { name: 'fitToPage', type: Boolean }, { name: 'pageOrder', type: String }, { name: 'blackAndWhite', type: Boolean }, { name: 'draft', type: Boolean }, { name: 'cellComments', type: String }, { name: 'errors', type: String }, { name: 'scale', type: Number }, { name: 'fitToWidth', type: Number }, { name: 'fitToHeight', type: Number }, { name: 'paperSize', type: paperSize }, { name: 'showRowColHeaders', type: Boolean }, { name: 'showGridLines', type: Boolean }, { name: 'firstPageNumber', type: Number }, { name: 'horizontalCentered', type: Boolean }, { name: 'verticalCentered', type: Boolean }]);
const worksheetViews = new Set([{ name: 'state', type: String }, { name: 'zoomScale', type: Number }, { name: 'rightToLeft', type: Boolean }, { name: 'activeCell', type: String }, { name: 'zoomScaleNormal', type: Number }, { name: 'showRuler', type: Boolean }, { name: 'style', type: String }, { name: 'showRowColHeaders', type: Boolean }, { name: 'showGridLines', type: Boolean }, { name: 'xSplit', type: Number }, { name: 'activeCell', type: String }, { name: 'ySplit', type: Number }, { name: 'topLeftCell', type: String }]);
const excelTest = require('./excelTest.json');
// createFillStyle : bg(背景顏色)RGB
// createAlignmentStyle:vt(垂直), ht(水平), tb(换行), tr(旋转)
// createFontStyle：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
// 0: '微软雅黑',
// 1: '宋体（Song）',
// 2: '黑体（ST Heiti）',
// 3: '楷体（ST Kaiti）',
// 4: '仿宋（ST FangSong）',
// 5: '新宋体（ST Song）',
// 6: '华文新魏',
// 7: '华文行楷',
// 8: '华文隶书',
// 9: 'Arial',
// 10: 'Times New Roman ',
// 11: 'Tahoma ',
// 12: 'Verdana',
function main(res, excelObj) {
    // 建立標籤為紅色的表格
    //var sheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}});
    // 建立網格線隱藏的表格
    //var sheet = workbook.addWorksheet('My Sheet', {properties: {showGridLines: false}});
    // 建立第一行第一列凍結的表格
    //var sheet = workbook.addWorksheet('My Sheet', {views:[{xSplit: 1, ySplit:1}]});
    if (!excelObj) excelObj = excelTest.excelTest;
    let workbook = new Excel.Workbook();
    workbookAttr.forEach(attr => {
        if (excelObj.workbookAttr[attr.name])
            workbook[attr] = attr.type(excelObj.workbookAttr[attr.name]);
    });
    Object.keys(excelObj.sheets).forEach(sheetName => {
        let state = excelObj.sheets[sheetName].state ? worksheetState.has(excelObj.sheets[sheetName].state) ? excelObj.sheets[sheetName].state : undefined : undefined;
        let properties = {};
        let pageSetup = {};
        let views = [];
        worksheetAttr.forEach(attr => {
            if (excelObj.sheets[sheetName].attr[attr.name])
                properties[attr.name] = attr.type(excelObj.sheets[sheetName].attr[attr.name]);
        });
        worksheetPageSetup.forEach(attr => {
            if (excelObj.sheets[sheetName].pageSetup[attr.name])
                pageSetup[attr.name] = attr.type(excelObj.sheets[sheetName].pageSetup[attr.name]);
        });
        excelObj.sheets[sheetName].views.forEach(item => {
            views.push(item);
        });
        let worksheet = workbook.addWorksheet(sheetName);
        worksheet.state = state;
        worksheet.properties = properties;
        worksheet.pageSetup = pageSetup;
        worksheet.views = views;
        let rowSetting = excelObj.sheets[sheetName].data.shift();

        rowSetting.forEach((column, index) => {
            worksheet.getColumn(index + 1).width = column.width;
        });

        excelObj.sheets[sheetName].data.forEach((row, index) => {
            let thisRow = worksheet.getRow(index + 1);
            let rowHeight = row.shift();
            thisRow.height = rowHeight.height;
            setStyleAndValue(row, worksheet);
            setMerge(row, worksheet);
            setBorder(row, worksheet);
            setNote(row, worksheet);
        });
    });
    res.status(200);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=teststream.xlsx'
    );
    workbook.xlsx.write(res).then(() => {
        res.end();
    });
}

var setNote = function (cellArr, worksheet) {
    cellArr.forEach(cell => {
        if (cell.note) worksheet.getCell(cell.row, cell.col).note = {
            texts: [{ "text": cell.note.text }],
            margins: cell.note.margins,
            protection: {
                locked: true,
                lockText: true
            }
        }
    });
}

var setMerge = function (cellArr, worksheet) {
    cellArr.forEach(function (cell) { // elem格式：{row : 起始行, cell : 起始列, rl : 合併行數, cl : 合併列數}
        worksheet.mergeCells(cell.row, cell.col, cell.row + (cell.rle || 1) - 1, cell.col + (cell.cle || 1) - 1);
    });
}

var setBorder = function (cellArr, worksheet) {
    cellArr.forEach(cell => {
        let border = borderConvert(cell.bt, cell.bs, cell.bc);
        worksheet.getCell(cell.row, cell.col).border = border;
    });
}
var setStyleAndValue = function (cellArr, worksheet) {
    cellArr.forEach(cell => {
        let fill = fillConvert(cell.bg);
        let font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul);
        let alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr);
        let value = cell.value;
        let target = worksheet.getCell(cell.row, cell.col);//, cell.row + (cell.rl || 1) - 1, cell.col + (cell.cl || 1) - 1
        target.fill = fill;
        target.font = font;
        target.alignment = alignment;
        target.value = value;
    });
}

var fillConvert = function (bg = `#FFFFFF`) {
    let fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bg.replace('#', '') }
    }
    return fill;
}

var fontConvert = function (ff = 0, fc = '#000000', bl = 0, it = 0, fs = 10, cl = 0, ul = 0) { // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
    const luckyToExcel = {
        0: '微软雅黑',
        1: '宋体（Song）',
        2: '黑体（ST Heiti）',
        3: '楷体（ST Kaiti）',
        4: '仿宋（ST FangSong）',
        5: '新宋体（ST Song）',
        6: '华文新魏',
        7: '华文行楷',
        8: '华文隶书',
        9: 'Arial',
        10: 'Times New Roman ',
        11: 'Tahoma ',
        12: 'Verdana',
        num2bl: function (num) {
            return num === 0 ? false : true
        }
    }

    let font = {
        name: luckyToExcel[ff],
        family: 1,
        size: fs,
        color: { argb: fc.replace('#', '') },
        bold: luckyToExcel.num2bl(bl),
        italic: luckyToExcel.num2bl(it),
        underline: luckyToExcel.num2bl(ul),
        strike: luckyToExcel.num2bl(cl)
    }

    return font
}

var alignmentConvert = function (vt = 'default', ht = 'default', tb = 'default', tr = 'default') { // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
    const luckyToExcel = {
        vertical: {
            0: 'middle',
            1: 'top',
            2: 'bottom',
            default: 'middle'
        },
        horizontal: {
            0: 'center',
            1: 'left',
            2: 'right',
            default: 'center'
        },
        wrapText: {
            0: false,
            1: false,
            2: true,
            default: false
        },
        textRotation: {
            0: 0,
            1: 45,
            2: -45,
            3: 'vertical',
            4: 90,
            5: -90,
            default: 0
        }
    }

    let alignment = {
        vertical: luckyToExcel.vertical[vt],
        horizontal: luckyToExcel.horizontal[ht],
        wrapText: luckyToExcel.wrapText[tb],
        textRotation: luckyToExcel.textRotation[tr]
    }
    return alignment

}

var borderConvert = function (borderType = 'border-all', style = 1, color = '#000') { // 对应luckysheet的config中borderinfo的的参数
    if (!borderType) {
        return {}
    }
    const luckyToExcel = {
        type: {
            'border-all': 'all',
            'border-top': 'top',
            'border-right': 'right',
            'border-bottom': 'bottom',
            'border-left': 'left'
        },
        style: {
            0: 'none',
            1: 'thin',
            2: 'hair',
            3: 'dotted',
            4: 'dashDot', // 'Dashed',
            5: 'dashDot',
            6: 'dashDotDot',
            7: 'double',
            8: 'medium',
            9: 'mediumDashed',
            10: 'mediumDashDot',
            11: 'mediumDashDotDot',
            12: 'slantDashDot',
            13: 'thick'
        }
    }
    let template = { style: luckyToExcel.style[style], color: { argb: color.replace('#', '') } }
    let border = {}
    if (luckyToExcel.type[borderType] === 'all') {
        border['top'] = template
        border['right'] = template
        border['bottom'] = template
        border['left'] = template
    } else {
        border[luckyToExcel.type[borderType]] = template
    }
    return border
}


module.exports = main;