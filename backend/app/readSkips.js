var readline = require('readline');
var Stream = require('stream');
var _ = require('lodash');
const fs = require('fs');

const getSkipsObject = (filename) => {
    return new Promise((resolve, reject) => {
        const readLines = readline.createInterface(fs.createReadStream(filename), new Stream());
        let skips = {};

        readLines.on('line', function(line) {
            if (line.trim()) {
                skips[line.trim()] = true;
            }
        });

        readLines.on('close', function() {
            console.log('Read all invoice documents to skip into memory.');
            resolve(skips);
        });
    });
};

const printJson = (data, filename) => {
	var logStream = fs.createWriteStream(filename, {'flags': 'w'});
    logStream.write(JSON.stringify(data));
    logStream.end();
    console.log('written to ' + filename);
};

const printSkipsToFile = (skips, oldSkips, filename) => {
	const toSkip = Object.assign(...skips, oldSkips);
	var logStream = fs.createWriteStream(filename, {'flags': 'w'});
	Object.keys(toSkip).forEach((value) => logStream.write(value + '\n'));
	logStream.end();
    console.log('Updated invoices to skip.');
};

const filterData = (skipData, data) => {
    var saleDoc = data['SaleDoc'].filter(item => !skipData[item.ID]);
    return {
        SaleDoc: saleDoc,
        SaleDocItem: data['SaleDocItem'].filter(item => !skipData[item.SALEDOCID]),
        DebtorAlloc: data['DebtorAlloc'].filter(item => !skipData[item.DEBITDOCUMENTID]),
        DebtorEntry: data['DebtorEntry'].filter(item => !skipData[item.DOCUMENTID]),
        Trader: data['Trader']
    }
};

const mergeIntoArrays = (arr, indexFunc) => {
    var merged = {};
    var merge = arr.forEach(item => {
        if (merged[item[indexFunc]] === undefined || merged[item[indexFunc]] === null) {
            merged[item[indexFunc]] = [item];
        } else {
            merged[item[indexFunc]].push(item);
        }
    });
    return merged;
} 

const filterData2 = (skipData, data) => {
    var saleDoc = Object.assign(...data['SaleDoc'].filter(item => !skipData[item.ID]).map(item => ({ [item.ID]: item })));
    var saleDocItem = data['SaleDocItem'].filter(item => !skipData[item.SALEDOCID]);
    return {
        SaleDoc: saleDoc,
        SaleDocItem: saleDocItem,
        DebtorAlloc: data['DebtorAlloc'].filter(item => !skipData[item.DEBITDOCUMENTID]),
        DebtorEntry: data['DebtorEntry'].filter(item => !skipData[item.DOCUMENTID]),
        Trader: data['Trader']
    }
};

module.exports = {
    getSkipsObject: getSkipsObject,
    printSkipsToFile: printSkipsToFile,
    printJson: printJson,
    filterData: filterData,
    filterData2: filterData2
}