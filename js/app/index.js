import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InvoiceAPI from './api/InvoiceAPI';

class PayInvoicesApplication extends Component {
  constructor() {
    super();
    
  }

  onSubmitForm(event) {
    const { invoiceId, surname } = this.state;
    event.preventDefault();
    if (invoiceId.touched && surname.touched) {
      this.setState({ isSearchingForInvoice: true });
      InvoiceAPI.checkWhetherInvoiceExists(invoiceId.value, surname.value)
        .then(({ invoiceExists, invoice }) => this.setState({
          isSearchingForInvoice: false,
          displayMessage: !invoiceExists,
          invoiceErrorMessage: !invoiceExists ? 'No invoice found!' : '',
          invoice,
        }))
        .catch((error) => {
          console.error(error);
          return this.setState({
            isSearchingForInvoice: false,
            invoiceErrorMessage: 'Error checking the database, please try again later.',
            displayMessage: true,
          });
        });
    } else {
      this.setState({
        isSearchingForInvoice: false,
        displayMessage: true,
        invoiceErrorMessage: 'Fill in all info!',
      });
    }
  }
}

ReactDOM.render(<PayInvoicesApplication />, document.getElementById('invoices-app'));
