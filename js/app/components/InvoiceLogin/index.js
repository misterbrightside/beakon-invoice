import React, { Component, PropTypes } from 'react';
import InvoiceLoginField from './InvoiceLoginField';
import style from './login-page.css';

const CheckInvoiceButton = () => (
  <div className={style.findInvoiceButtonContainer}>
    <button type={'submit'}>
      Find my invoice ➔
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
    surname: PropTypes.shape({
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

  render() {
    const {
      invoiceId,
      surname,
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
            id={'invoiceId'}
            label={'Invoice Number'}
            value={invoiceId.value}
            onUpdateInput={updateFieldValue('invoiceId')}
            errorMessage={<InputFieldError label={'You must enter a valid invoice reference.'} />}
            isValid={this.isValid('invoiceId')}
          />
          <InvoiceLoginField
            label={'Surname'}
            value={surname.value}
            onUpdateInput={updateFieldValue('surname')}
            errorMessage={<InputFieldError label={'You must enter a valid surname.'} />}
            isValid={this.isValid('surname')}
          />
          <CheckInvoiceButton />
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
