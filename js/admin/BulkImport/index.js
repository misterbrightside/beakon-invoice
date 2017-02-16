import React, { Component } from 'react';
import { render } from 'react-dom';
import Dropzone from 'react-dropzone';
import { isEmpty, camelCase } from 'lodash';
import style from './bulk-import-styles.css'

const getInvoices = (invoices) => {
  const form = new FormData();
  form.append('invoices', JSON.stringify(invoices));
  return form;
}

const workbookToJSON = (workbook) => {
  return workbook.SheetNames.map((sheet) =>
    XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
  );
};

const getValues = (objects, filterKey, filterValue) => {
  return objects.filter(item => {
    return item[filterKey] === filterValue
  })
};

const convert = (array) => {
  return array.map(object => convertObject(object));
};

const getSalesDoc = (sale) => convertObject(sale); 
const getInvoice = (invoiceId, salesDocsItems) => convert(getValues(salesDocsItems, 'Sales Document Origin', invoiceId));
const getCustomer = (customerCode, customers) => convert(getValues(customers, 'Account', customerCode))[0];

const convertObject = (object) => {
  return Object.assign(...Object.keys(object).map(key => {
    const value = object[key];
    return { [camelCase(key)]: value };
  }));
};

const getFullDetailsOfAnInvoice = (salesDocItem, salesDocsBook, salesDocsItems, customersBook) => {
  const invoiceId = salesDocItem['Origin'];
  const customerCode = salesDocItem['Customer Code'];
  return {
    salesDocument: getSalesDoc(salesDocItem),
    customer: getCustomer(customerCode, customersBook),
    invoice: getInvoice(invoiceId, salesDocsItems),
  };
};

class BulkImport extends Component {

  constructor() {
    super();
    this.state = {
      customers: [],
      customersName: '',
      salesDoc: [],
      salesDocName: '',
      invoices: []
    };
  }
  
  openFile(file, type) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      this.setState({
        [type]: workbookToJSON(XLSX.read(data, { type: 'binary' })),
        [type + "Name"]: file.name
      });
    };
    reader.readAsBinaryString(file);
  }

  onAddSalesDocs = (acceptedFiles, rejectedFiles) => {
    this.openFile(acceptedFiles[0], 'salesDoc');
  }

  onAddCustomers = (acceptedFiles, rejectedFiles) => {
    this.openFile(acceptedFiles[0], 'customers');
  }

  onSubmitDocsForJoin = (event) => {
    event.preventDefault();
    const { salesDoc, customers } = this.state;
    const salesDocsBook = salesDoc[0];
    const salesDocsItems = salesDoc[1];
    const customersBook = customers[0];
    const invoices = salesDocsBook.map(salesDoc => getFullDetailsOfAnInvoice(salesDoc, salesDocsBook, salesDocsItems, customersBook));
    this.setState({
      invoices,
      salesDoc: [],
      customers: []
    });
  }

  onSubmitDocsToWordPress = (event) => {
    event.preventDefault();
    fetch('/wp-json/beakon-invoices/v1/add-invoices', {
      method: 'POST',
      body: getInvoices(this.state.invoices)
    })
      .then(response => response.json())
      .then(json => console.log(JSON.parse(json)));
  }

  render() {
    const joinDisabled = isEmpty(this.state.salesDoc) || isEmpty(this.state.customers);
    const submitDisabled = !this.state.invoices.length > 0;
    return (
      <div className={style.container}>
        <div className={style.flex}>
          <div>
            <button className={style.button}>
              <Dropzone onDrop={this.onAddSalesDocs} style={{}}>Upload Sales Document</Dropzone>
            </button>
            { this.state.salesDocName ? `Chosen ${this.state.salesDocName}!` : null }
          </div>
          <div>
            <button className={style.button}>
              <Dropzone onDrop={this.onAddCustomers} style={{}}>Add Customers document</Dropzone>
            </button>
            { this.state.customersName ? `Chosen ${this.state.customersName}!` : null }
          </div>
          <div>
            <button
              className={style.button}
              onClick={this.onSubmitDocsForJoin}
              disabled={joinDisabled}
            >
                Compute joins of documents
            </button>
            { this.state.invoices.length > 0 ? `${this.state.invoices.length} invoices selected for addition to the database.` : null}
          </div>
          <button
            className={style.button} 
            onClick={this.onSubmitDocsToWordPress}
            disabled={submitDisabled}
          >
              Submit To database
            </button>
        </div>
      </div>
    );
  }
}

render(<BulkImport />, document.getElementById('bulk-import'));
