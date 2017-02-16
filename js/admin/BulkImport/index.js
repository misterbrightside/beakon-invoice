import React, { Component } from 'react';
import { render } from 'react-dom';
import Dropzone from 'react-dropzone';
import { isEmpty, camelCase } from 'lodash';

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
  
  openFile(file, type) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      this.setState({
        [type]: workbookToJSON(XLSX.read(data, { type: 'binary' }))
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
    return (
      <div>
        <button>
          <Dropzone onDrop={this.onAddSalesDocs} style={{}}>Upload Sales Document</Dropzone>
        </button>
        <button>
          <Dropzone onDrop={this.onAddCustomers} style={{}}>Add Customers document</Dropzone>
        </button>
        <button onClick={this.onSubmitDocsForJoin}>Compute joins of documents</button>
        <button onClick={this.onSubmitDocsToWordPress}>Submit To database</button>
      </div>
    );
  }
}

render(<BulkImport />, document.getElementById('bulk-import'));
