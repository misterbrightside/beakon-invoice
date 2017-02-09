import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InvoiceLogin from './InvoiceLogin';
import InvoiceAPI from './api/InvoiceAPI';


class PayInvoicesApplication extends Component {

  constructor() {
    super();
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.state = {
      loginForm: {
        isSearchingForInvoice: false,
        invoiceErrorMessage: '',
        displayMessage: false,
        invoiceId: this.getInitialInputState(),
        surname: this.getInitialInputState(),
        invoice: null
      },
    };
  }

  getInitialInputState() {
    return ({
      value: '',
      valid: false,
      touched: false
    });
  }

  setStateAfterCheckingWhetherInvoiceExists = ({ invoiceExists, invoice }) => {
    return this.setState((previousState) => ({ 
        loginForm: Object.assign({}, previousState.loginForm, {
          isSearchingForInvoice: false,
          displayMessage: !invoiceExists,
          invoiceErrorMessage: !invoiceExists ? 'No invoice found!' : '',
          invoice,
        })
      })
    );
  }

  setStateAfterCheckingInvoiceExistsFailed = (error) => {
    console.error(error);
    return this.setState(() => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: 'Error checking the database, please try again later.',
        displayMessage: true,
      })
    }));
  }

  setLoadingState() {
    return this.setState((previousState) => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: true,
      })
    }));
  }

  tellUserToFillInAllInfo() {
    return this.setState((previousState) => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        displayMessage: true,
        invoiceErrorMessage: 'Fill in all info!',
      })
    }))
  }

  fieldValid(field) {
    return field.touched && field.valid;
  }

  formValid(invoiceId, surname) {
    return this.fieldValid(invoiceId) && this.fieldValid(surname);
  }

  onSubmitForm(event) {
    const {invoiceId, surname} = this.state.loginForm;
    event.preventDefault();
    if (this.formValid(invoiceId, surname)) {
      this.setLoadingState();
      InvoiceAPI.checkWhetherInvoiceExists(invoiceId.value, surname.value)
        .then(this.setStateAfterCheckingWhetherInvoiceExists)
        .catch(this.setStateAfterCheckingInvoiceExistsFailed);
    } else {
      this.tellUserToFillInAllInfo();
    }
  }

  setNewValue(id, value) {
    return this.setState((previousState) => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        [id]: {
          value,
          valid: value.trim().length > 0,
          touched: true,
        }})}
      )
    );
  }

  updateFieldValue = (id) => (event) => {
    event.preventDefault();
    const { value } = event.target;
    return this.setNewValue(id, value);
  }

  render() {
    return (
      <InvoiceLogin 
        { ... this.state.loginForm }
        updateFieldValue={this.updateFieldValue}
        onSubmitForm={this.onSubmitForm}
      />
    );
  }
}

ReactDOM.render(<PayInvoicesApplication />, document.getElementById('invoices-app'));
