const promisify = require("promisify-node");
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const readDir = promisify(fs.readdir);

const directoryOfExcelFiles = (args) => args[args.length - 1];
const isExcelFile = file => (/\.(xlsx|xls)$/i).test(file);
const isCorrectFormatFilename = file => (/\d{10}/i).test(file.substr(0, 10));
const fileType = file => file.slice(15, file.indexOf('.'));

const getFilesObject = (files, required, pathDir) => {
	const fileObjects = files.map(file => {
		const type = fileType(file);
		return required.includes(type) ? { [type]: path.resolve(process.cwd(), pathDir + file) } : null;
	});
	return Object.assign(...fileObjects);
};

const getFileNames = (path, files, err) => {
	const filesRequired = ['DebtorAlloc', 'DebtorEntry', 'SaleDoc', 'SaleDocItem', 'Trader'];
	if (err) throw Error(err);

	const excelFiles = files.filter(isExcelFile);
	const neededExcelFiles = excelFiles.filter(isCorrectFormatFilename);
	return getFilesObject(neededExcelFiles, filesRequired, path);
}

const getFiles = (path) => readDir(path)
	.then((files, err) => getFileNames(path, files, err));

const parseRow = (data, file) => {
	if (globalData[file] === undefined) {
		globalData[file] = [];
	}
	globalData[file].push(data);
};

const parseFile = (filePath, key, childProcess) => {
	const arrayOfData = [];
	return new Promise((resolve, reject) => {
		const file = XLSX.readFile(filePath);
		const sheetname = file.SheetNames[0];
		const ref = file.Sheets[sheetname];
		const json = XLSX.utils.sheet_to_json(ref);
		console.log('Loading ' + filePath + '...');
		childProcess.send({message: 'fileLoaded', file: filePath});
		resolve({ [key]: json });
	});
}

const loadExcelFiles = (files, childProcess) => {
	const streamPromises = Object.keys(files).map(file => parseFile(files[file], file, childProcess));
	return Promise.all(streamPromises)
		.then((data) => Object.assign(...data));
};

module.exports = {
	getFiles: getFiles,
	loadExcelFiles: loadExcelFiles
};






