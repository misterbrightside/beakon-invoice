import React, { Component, PropTypes } from 'react';
import InvoiceLoginField from './InvoiceLoginField';
import style from './login-page.css';
import buttonStyle from '../Button/button.css';

const CheckInvoiceButton = ({ disabled }) => (
  <div className={style.findInvoiceButtonContainer}>
    <button
      type={'submit'}
      className={buttonStyle.primary}
      disabled={disabled}
    >
      Find my invoice
    </button>
  </div>
);

const InputFieldError = ({ label }) => (
  <div className={style.inputFieldErrorMessage}>
    { label }
  </div>
);

const InvoiceAPISearchIndicator = ({ invoiceErrorMessage, isSearchingForInvoice }) => {
  if (isSearchingForInvoice) {
    return (
      <div>
        Loading...
      </div>
    );
  } else if (invoiceErrorMessage) {
    return (
      <div>
        { invoiceErrorMessage }
      </div>
    );
  }
  return null;
};

class InvoiceLogin extends Component {
  static propTypes = {
    invoiceId: PropTypes.shape({
      value: PropTypes.string.isRequired,
      valid: PropTypes.bool.isRequired,
      touched: PropTypes.bool.isRequired,
    }),
    accountCode: PropTypes.shape({
      value: PropTypes.string.isRequired,
      valid: PropTypes.bool.isRequired,
      touched: PropTypes.bool.isRequired,
    }),
    isSearchingForInvoice: PropTypes.bool.isRequired,
    invoiceErrorMessage: PropTypes.string.isRequired,
    onSubmitForm: PropTypes.func.isRequired,
    updateFieldValue: PropTypes.func.isRequired,
  }

  isValid = field => (
    this.props[field].valid || !this.props[field].touched
  )

  isValidInvoiceNumber = field => {
    const value = this.props[field].value;
    return (value.startsWith('SI-') || value.startsWith('WO-') || !this.props[field].touched) && this.isValid(field);
  }

  render() {
    const {
      invoiceId,
      accountCode,
      emailAddress,
      isSearchingForInvoice,
      invoiceErrorMessage,
      onSubmitForm,
      updateFieldValue,
    } = this.props;

    return (
      <div className={style.invoicesLogin}>
        <form
          className={style.invoicesContainer}
          onSubmit={onSubmitForm}
        >
          <h1 className={style.invoicesLoginHeader}>Pay a Bill</h1>
          <InvoiceLoginField
            label={'Email Address'}
            value={emailAddress.value}
            onUpdateInput={updateFieldValue('emailAddress')}
            errorMessage={<InputFieldError label={'This is not a valid email address.'} />}
            isValid={this.isValid('emailAddress')}
            tooltipText={'This is an email address which we will send a reciept on payment of the invoice.'}
          />
          <InvoiceLoginField
            id={'invoiceId'}
            label={'Invoice Number'}
            value={invoiceId.value}
            onUpdateInput={updateFieldValue('invoiceId')}
            errorMessage={<InputFieldError label={'‘Your invoice number does not match the correct format. It should take the form “SI-“ or “WO-“ followed by 6 digits.'} />}
            isValid={this.isValidInvoiceNumber('invoiceId')}
            tooltipText={'This must be a valid SI number or WO number which you have recieved!'}
          />
          <InvoiceLoginField
            label={'Account Code'}
            value={accountCode.value}
            onUpdateInput={updateFieldValue('accountCode')}
            errorMessage={<InputFieldError label={'You must enter a valid accountCode. i.e. NAME01'} />}
            isValid={this.isValid('accountCode')}
            tooltipText={'The account number provided on your invoice. i.e. NAME01'}
          />
          <CheckInvoiceButton disabled={!(this.isValid('accountCode') && this.isValidInvoiceNumber('invoiceId'))} />
          { invoiceErrorMessage ?
            <InvoiceAPISearchIndicator
              invoiceErrorMessage={invoiceErrorMessage}
              isSearchingForInvoice={isSearchingForInvoice}
            /> : null
          }
        </form>
      </div>
    );
  }
}

export default InvoiceLogin;
