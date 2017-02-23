import React, { Component } from 'react';
import { isEmpty, camelCase } from 'lodash';
import InvoiceLogin from '../InvoiceLogin/';
import InvoiceView from '../InvoiceView/';
import InvoiceAPI from '../../api/InvoiceAPI';

export default class PayInvoicesApplication extends Component {

  constructor(props) {
    super(props);
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

  setStateAfterCheckingWhetherInvoiceExists = 
  ({ invoiceId, invoice, customer, salesDocument, paymentResponse }) => (
    this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: !invoiceId ? 'No invoice found!' : '',
      }),
      invoice: Object.assign({}, previousState.invoice, {
        payload: invoiceId ? salesDocument : {},
        items: invoice,
        paymentResponse: paymentResponse[paymentResponse.length - 1],
        customer
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
        items: [],
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

  prepareInvoiceObject(invoiceData) {
    return invoiceData;
  }

  updateFieldValue = id => (event) => {
    event.preventDefault();
    const { value } = event.target;
    return this.setNewValue(id, value);
  }

  onClickClearState = (event) => {
    event.preventDefault();
    this.setState(() => this.getInitialApplicationState());
  }

  render() {
    const { loginForm, invoice, customer } = this.state;
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
        items={invoice.items}
        customer={invoice.customer}
        paymentResponse={invoice.paymentResponse}
        onClickClearState={this.onClickClearState}
      />
    ) : null;
    return !isEmpty(invoice.payload) ? invoiceView : loginScreen;
  }
}