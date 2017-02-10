import React, { Component } from 'react';
import { isEmpty, camelCase } from 'lodash';
import { render } from 'react-dom';
import InvoiceLogin from './components/InvoiceLogin/';
import InvoiceView from './components/InvoiceView/';
import InvoiceAPI from './api/InvoiceAPI';

class PayInvoicesApplication extends Component {

  constructor() {
    super();
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.updateFieldValue = this.updateFieldValue.bind(this);
    this.state = this.getInitialApplicationState();
  }

  onSubmitForm(event) {
    const { invoiceId, surname } = this.state.loginForm;
    event.preventDefault();
    if (this.formValid(invoiceId, surname)) {
      this.checkWhetherInvoiceExists(invoiceId, surname);
    } else {
      this.tellUserToFillInAllInfo();
    }
  }

  setLoadingState() {
    return this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: true,
      }),
    }));
  }

  setStateAfterCheckingWhetherInvoiceExists = ({ invoiceExists, invoice }) => (
    this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: !invoiceExists ? 'No invoice found!' : '',
      }),
      invoice: Object.assign({}, previousState.invoice, {
        payload: invoiceExists ? invoice : {},
      }),
    }))
  )

  getInitialInputState = () => ({
    value: '',
    valid: false,
    touched: false,
  })

  getInitialApplicationState() {
    return {
      loginForm: {
        isSearchingForInvoice: false,
        invoiceErrorMessage: '',
        invoiceId: this.getInitialInputState(),
        surname: this.getInitialInputState(),
      },
      invoice: {
        payload: {},
      },
    };
  }

  setNewValue(id, value) {
    return this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        [id]: {
          value,
          valid: value.trim().length > 0,
          touched: true,
        } }) }
      ),
    );
  }

  setStateAfterCheckingInvoiceExistsFailed = error => (
    this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: `Error checking the database, please try again later: ${error}.`,
      }),
    }))
  )

  formValid(invoiceId, surname) {
    return this.fieldValid(invoiceId) && this.fieldValid(surname);
  }

  checkWhetherInvoiceExists(invoiceId, surname) {
    this.setLoadingState();
    InvoiceAPI.checkWhetherInvoiceExists(invoiceId.value, surname.value)
      .then(this.setStateAfterCheckingWhetherInvoiceExists)
      .catch(this.setStateAfterCheckingInvoiceExistsFailed);
  }

  fieldValid = field => (
    field.touched && field.valid
  )

  tellUserToFillInAllInfo() {
    return this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: 'Fill in all info!',
      }),
    }));
  }

  santizeInvoiceObject(invoiceData) {
    return Object.keys(invoiceData).map((key) => {
      const value = invoiceData[key];
      const cleanAttribute = { [camelCase(key)]: value[0] };
      return cleanAttribute;
    });
  }

  prepareInvoiceObject(invoiceData) {
    return Object.assign(...this.santizeInvoiceObject(invoiceData));
  }

  updateFieldValue = id => (event) => {
    event.preventDefault();
    const { value } = event.target;
    return this.setNewValue(id, value);
  }

  render() {
    const { loginForm, invoice } = this.state;
    const loginScreen = (
      <InvoiceLogin
        {... loginForm}
        updateFieldValue={this.updateFieldValue}
        onSubmitForm={this.onSubmitForm}
      />
    );
    const invoiceView = !isEmpty(invoice.payload) ? (
      <InvoiceView
        {... this.prepareInvoiceObject(invoice.payload) }
      />
    ) : null;
    return !isEmpty(invoice.payload) ? invoiceView : loginScreen;
  }
}

render(<PayInvoicesApplication />, document.getElementById('invoices-app'));
