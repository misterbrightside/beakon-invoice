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
    const { invoiceId, accountCode } = this.state.loginForm;
    event.preventDefault();
    if (this.formValid(invoiceId, accountCode)) {
      this.checkWhetherInvoiceExists(invoiceId, accountCode);
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

  setStateAfterCheckingWhetherInvoiceExists = (payload) => (
    this.setState(previousState => ({
      loginForm: Object.assign({}, previousState.loginForm, {
        isSearchingForInvoice: false,
        invoiceErrorMessage: !payload.invoiceId ? 'The invoice number and reference number you provided did not match. Please ensure you have entered both correctly.' : '',
      }),
      invoice: Object.assign({}, previousState.salesDocItems, {
        invoiceDoc: payload.invoiceId ? payload.salesDoc : {},
        items: payload.salesDocItems,
        paymentResponse: payload.paymentResponse ? payload.paymentResponse[payload.paymentResponse.length - 1] : { RESPONSECODE: '', DATETIME: null },
        customer: payload.customer,
        leftToPay: payload.paymentResponse ? payload.paymentResponse[payload.paymentResponse.length - 1].AMOUNT - payload.leftToPay : payload.leftToPay,
        total: payload.total,
        paid: payload.paymentResponse ? payload.paymentResponse[payload.paymentResponse.length - 1].AMOUNT : payload.paid,
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
        accountCode: this.getInitialInputState(),
        emailAddress: this.getInitialInputState(),
      },
      invoice: {
        invoiceDoc: {},
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

  formValid(invoiceId, accountCode) {
    return this.fieldValid(invoiceId) && this.fieldValid(accountCode);
  }

  checkWhetherInvoiceExists(invoiceId, accountCode) {
    this.setLoadingState();
    InvoiceAPI.checkWhetherInvoiceExists(invoiceId.value, accountCode.value)
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
    const invoiceView = !isEmpty(invoice.invoiceDoc) ? (
      <InvoiceView
        salesDoc={invoice.invoiceDoc}
        leftToPay={invoice.leftToPay}
        paid={invoice.paid}
        total={invoice.total}
        items={invoice.items}
        customer={invoice.customer}
        paymentResponse={invoice.paymentResponse}
        onClickClearState={this.onClickClearState}
        emailOfUser={loginForm.emailAddress.value}
      />
    ) : null;
    return !isEmpty(invoice.invoiceDoc) ? invoiceView : loginScreen;
  }
}