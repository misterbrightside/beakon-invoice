import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import InvoiceLoginField from './InvoiceLoginField'
import InvoiceAPI from './api/InvoiceAPI'
import style from './login-page.css'
import { escape } from 'lodash'

const CheckInvoiceButton = () => (
  <div className={ style.findInvoiceButtonContainer }>
    <button type="submit">
      Find my invoice ➔
    </button>
  </div>
);

const InputFieldError = ({label}) => (
  <div className={ style.inputFieldErrorMessage }>
    { label }
  </div>
);

const InvoiceAPISearchIndicator = ({invoiceErrorMessage, displayMessage, isSearchingForInvoice}) => {
  if (isSearchingForInvoice) {
    return (
      <div>
        Loading...
      </div>
    );
  } else if (displayMessage && invoiceErrorMessage) {
    return (
      <div>
        { invoiceErrorMessage }
      </div>
    );
  } else return null;
};

class InvoiceLogin extends Component {
  constructor() {
    super()
    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
  }

  getInitialInputState() {
    return ({
      value: '',
      valid: false,
      touched: false
    })
  }

  updateFieldValue = (id) => (event) => {
    event.preventDefault()
    const {value} = event.target
    return this.setState({
      [id]: {
        value,
        valid: value.trim().length > 0,
        touched: true
      }
    })
  }



  isValid = (field) => {
    return this.state[field].valid || !this.state[field].touched
  }

  render() {
    const {invoiceId, surname, isSearchingForInvoice, displayMessage, invoiceErrorMessage} = this.props;
    return (
      <div className={ style.invoicesLogin }>
        <form className={ style.invoicesContainer } onSubmit={ this.onSubmitForm }>
          <h1 className={ style.invoicesLoginHeader }>Pay a Bill</h1>
          <InvoiceLoginField label={ 'Invoice Number' }
            value={ invoiceId.value }
            onUpdateInput={ this.updateFieldValue('invoiceId') }
            errorMessage={ <InputFieldError label={ 'You must enter a valid invoice reference.' } /> }
            isValid={ this.isValid('invoiceId') }
          />
          <InvoiceLoginField label={ 'Surname' }
            value={ surname.value }
            onUpdateInput={ this.updateFieldValue('surname') }
            errorMessage={ <InputFieldError label={ 'You must enter a valid surname.' } /> }
            isValid={ this.isValid('surname') }
          />
          <CheckInvoiceButton />
          { displayMessage ?
            <InvoiceAPISearchIndicator invoiceErrorMessage={ invoiceErrorMessage } displayMessage={ displayMessage } isSearchingForInvoice={ isSearchingForInvoice } /> : null }
        </form>
      </div>
    );
  }
}

export default InvoiceLogin;
