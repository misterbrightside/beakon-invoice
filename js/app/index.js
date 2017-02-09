import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InvoiceLogin from './InvoiceLogin';
import InvoiceAPI from './api/InvoiceAPI';
import { isEmpty } from 'lodash';

class PayInvoicesApplication extends Component {

  constructor() {
    super();
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.state = this.getInitialApplicationState();
  }

  getInitialApplicationState() {
    return {
      loginForm: {
        isSearchingForInvoice: false,
        invoiceErrorMessage: '',
        invoiceId: this.getInitialInputState(),
        surname: this.getInitialInputState(),
      },
      invoice: {
        payload: {}
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
        invoiceErrorMessage: !invoiceExists ? 'No invoice found!' : '',
      }), 
      invoice: Object.assign({}, previousState.invoice, {
        payload: invoiceExists ? invoice : {}
      }),
    }));
  }

  setStateAfterCheckingInvoiceExistsFailed = (error) => {
    console.error(error);
    return this.setState(() => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: 'Error checking the database, please try again later.',
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

  checkWhetherInvoiceExists(invoiceId, surname) {
    this.setLoadingState();
    InvoiceAPI.checkWhetherInvoiceExists(invoiceId.value, surname.value)
      .then(this.setStateAfterCheckingWhetherInvoiceExists)
      .catch(this.setStateAfterCheckingInvoiceExistsFailed);
  }

  onSubmitForm(event) {
    const {invoiceId, surname} = this.state.loginForm;
    event.preventDefault();
    if (this.formValid(invoiceId, surname)) {
      this.checkWhetherInvoiceExists(invoiceId, surname);
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
    const { loginForm, invoice } = this.state;
    const loginScreen = (
      <InvoiceLogin
        { ... loginForm }
        updateFieldValue={this.updateFieldValue}
        onSubmitForm={this.onSubmitForm}
      />
    );
    const invoiceView = (
      <div>Hello guys!</div>
    );
    return !isEmpty(invoice.payload) ? invoiceView : loginScreen;
  }
}

ReactDOM.render(<PayInvoicesApplication />, document.getElementById('invoices-app'));
