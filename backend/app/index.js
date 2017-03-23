require('es6-promise').polyfill();
require('isomorphic-fetch');
const files = require('./files');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const skips = require('./readSkips');
var ipc = require('electron').ipcRenderer;


function uploadFiles(path, skipsFilePath, uploadPath, callback) {
	const excelDataPromise = files.getFiles(path)
		.then(files.loadExcelFiles);

	const skipPromise = skips.getSkipsObject(skipsFilePath);

	console.log('hi i is here.');
	let func = (skipList, data, id, size, position) => {
		if (skipList[id] !== undefined) {
			return null;
		}
		const saleDoc = data['SaleDoc'][id];
		const customerId = saleDoc['CUSTOMERID'];
		const saleDocItems = data['SaleDocItem'].filter(y => y.SALEDOCID === id);
		const customer = data['Trader'].filter(y => y.ID === customerId)[0];
		const debtorAlloc = data['DebtorAlloc'].filter(y => y.DEBITDOCUMENTID === id);
		const total = saleDocItems
			.map(item => parseFloat(item.FRGAMOUNTVATEXC, 10) + parseFloat(item.FRGVATAMOUNT, 10))
			.reduce((total, item) => total + item, 0);
		const paid = debtorAlloc
			.map(debit => parseFloat(debit.FRGAMOUNT, 10))
			.reduce((total, item) => total + item, 0);
		const debtorEntry = data['DebtorEntry'].filter(y => y.DOCUMENTID === id);
		const amountFree = debtorEntry.reduce((total, value) => total + parseFloat(value['R$FRGAMOUNTFREE'], 10), 0);
		const amountAllocated = debtorEntry.reduce((total, value) => total + parseFloat(value['R$FRGAMOUNTALLOCATED']), 0);
		const leftToPay = _.round(total, 2) - _.round(paid, 2);
		const isPaidByCredit = _.round(Math.abs(amountAllocated), 2) === _.round(total, 2) || _.round(amountFree, 2) === _.round(total, 2);
		if (leftToPay === 0 || isPaidByCredit) return { [id]: 'skip', skip: true };
		return {
			saleDocItems: saleDocItems,
			customer: customer,
			debtorAlloc: debtorAlloc,
			saleDoc: saleDoc,
			total: _.round(total, 2),
			paid: _.round(paid, 2),
			leftToPay: _.round(leftToPay, 2),
			debtorEntry: debtorEntry,
			amountFree: amountFree
		};
	}

	var filtered = (arr1, arr2) => arr1.filter(function(e){return this.indexOf(e)<0;},arr2);
 	return new Promise((resolve, reject) => {
		 Promise.all([excelDataPromise, skipPromise])
		.then(([excelData, skipData]) => {
			console.log('Files loaded..');
			let slice = excelData['SaleDoc'].map(i => i.ID);
			let trimmedData = skips.filterData2(skipData, excelData);
			const idsToSkip = Object.keys(skipData).map(id => parseInt(id, 10));
			const arrayToDo = filtered(slice, idsToSkip);
			
			console.log('starting to process');
			const processed = arrayToDo.map((i, index, arr) => func(skipData, trimmedData, i, arr.length, index));
			const newSkips = processed.filter(item => item !== null).filter(item => item.skip === true);
			const todo = processed.filter(item => item !== null).filter(item => !item.skip);
			skips.printSkipsToFile(newSkips, skipData, skipsFilePath);
			return todo;
		})
		.then(invoices => {
			const toSend = invoices.filter(invoice => moment(invoice.saleDoc.POSTDATE, "MM/DD/YYYY").year() >= 2016);
			fetch(uploadPath + 'wp-json/beakon-invoices/v1/invoices', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(toSend)
			})
				.then(res => {
					return res.text();
				})
				.then(json => {
					console.log('Finished posting invoices to web application.');
					callback();
				})
				.catch(res => {
					console.log(res);
				});
		});
	 });
};

module.exports = {
	upload: uploadFiles
}