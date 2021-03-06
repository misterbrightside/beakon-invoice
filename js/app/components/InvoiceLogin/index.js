import React, { Component, PropTypes } from 'react';
import InvoiceLoginField from './InvoiceLoginField';
import ReactDOMServer from 'react-dom/server';
import LoadingIndicator from '../LoadingIndicator/';
import EmailInvoice from '../InvoiceView/EmailInvoice';
import InvoiceAPI from '../../api/InvoiceAPI';
import IFrame from '../IFrame/';
import style from './login-page.css';
import buttonStyle from '../Button/button.css';
import ThanksForOrdering from '../ThankYouScreen/';

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

  constructor(props) {
    super(props);
    this.state = {
      displayPaymentRedirectLoading: false,
      isNewOrder: this.isRedirectToNewOrder(),
      isThankYouScreen: this.isThankYouScreen(),
      orderParams: this.getUrlParams(window.location.href),
      url: null,
      orderId: null
    };
  }

  componentDidMount() {
    if (this.state.isNewOrder) {
      this.setState({ displayPaymentRedirectLoading: true });
      InvoiceAPI.getURLForWorldNetPaymentForNewOrder(this.getUrlParams(window.location.href))
        .then(res => res.json())
        .then(({ url }) => {
          const params = this.getUrlParams(url);          
          this.setState({
            url: url,
            orderId: params.ORDERID,
            displayPaymentRedirectLoading: false,
          });
        })
        .catch((error) => {
          this.setState({
            displayPaymentRedirectLoading: false,
          });
        });
    } else if (this.state.isThankYouScreen) {
      this.setState({ displayPaymentRedirectLoading: true });
      InvoiceAPI.getURLForWorldNetPaymentForNewOrder(this.getUrlParams(window.location.href))
        .then(res => res.json())
        .then(({ url }) => {
          const params = this.getUrlParams(url);          
          this.setState({
            orderId: params.ORDERID,
            displayPaymentRedirectLoading: true,
          })
        })
    }
  }

  isValid = field => (
    this.props[field].valid || !this.props[field].touched
  )

  isValidEmail = field => {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(this.props[field].value) || !this.props[field].touched;
  };

  isValidInvoiceNumber = field => {
    const value = this.props[field].value;
    return (value.startsWith('SI-') || value.startsWith('SO-') || value.startsWith('WO-') || !this.props[field].touched) && this.isValid(field);
  }

  isRedirectToNewOrder() {
    const params = this.getUrlParams(window.location.href);
    return params && params.PayNow === "true";
  }

  isThankYouScreen() {
    const params = this.getUrlParams(window.location.href);
    return params && params.PayNow === "false";
  }

  getUrlParams(url) {
    var queryString = url.split("?")[1];
    if (queryString) {
      var keyValuePairs = queryString.split("&");
      var keyValue, params = {};
      keyValuePairs.forEach(function(pair) {
        keyValue = pair.split("=");
        params[keyValue[0]] = decodeURIComponent(keyValue[1]).replace("+", " ");
      });
      return params;
    } else return {
      isNewOrder: false
    }
  }

  getEmailProps(orderParams, payload) {
    return {
      saleDoc: {
        NUMBER: payload.ORDERID,
        POSTDATE: orderParams.date,
        REMARKS: '',
        REFERENCE: '',
      },
      customer: {
        NAME: orderParams.name,
        ADDRLINE01: orderParams.add1,
        ADDRLINE02: orderParams.add2,
        ADDRLINE03: orderParams.town,
        ADDRLINE04: orderParams.county,
        ADDRLINE05: orderParams.eircode
      },
      items: [{
        NAME: orderParams.ftype,
        QUANTITY: orderParams.quant,
        BUDGET: orderParams.budget
      }],
      paid: 0
    };
  }

  getInvoiceMarkup = (objectParams) => {
    return ReactDOMServer.renderToStaticMarkup(
      <ThanksForOrdering
        message={<span>Paid Online with WorldNet</span>} 
        orderId={this.state.orderId}
        {...this.state.orderParams}
      />
    );
  }

  getResponseParameters = (url) => {
    const params = url.slice(url.indexOf('?') + 1).split('&');
    const objectParams = Object.assign(...params.map((param) => {
      const [key, value] = param.split('=');
      return { [key]: value };
    }));
    return Object.assign(objectParams, { MARKUP: this.getInvoiceMarkup(objectParams) });
  }

  onPaymentAttempt = (event) => {
    const { href } = event.target.contentWindow.location;
    const payload = this.getResponseParameters(href);
    this.setState({
      paymentSuccessPayload: payload,
      displayPaymentRedirectLoading: false,
      redirectToPaymentUrl: false,
    });
    const newPayload = Object.assign(payload, this.state.orderParams);
    InvoiceAPI.updatePaymentStatusOfInvoice(newPayload);
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


    if (this.state.paymentSuccessPayload) {
      return (
        <ThanksForOrdering
          message={<span>Paid Online with WorldNet</span>} 
          orderId={this.state.orderId}
          {...this.state.orderParams}
        />
      );
    } 
    else if (this.state.isThankYouScreen) {
      return (
        <ThanksForOrdering 
          message={<span className={style.paymentBlurb}>Payment to be arranged.</span>}
          orderId={this.state.orderId} 
          {...this.state.orderParams}
        />
      );
    }
    else if (this.state.isNewOrder && this.state.displayPaymentRedirectLoading) {
      return (
        <div>
          <LoadingIndicator /> 
          Loading WorldNet...
        </div>
      );
    } else if (this.state.isThankYouScreen && this.state.displayPaymentRedirectLoading) {
        <div>
          <LoadingIndicator /> 
          Loading...
        </div>
    } else if (this.state.isNewOrder && this.state.url) {
      return (
        <IFrame
          src={this.state.url}
          maybeOnLoad={this.onPaymentAttempt}
        />
      );
    } else {
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
            <InvoiceLoginField
              label={'Email Address for receipt'}
              value={emailAddress.value}
              onUpdateInput={updateFieldValue('emailAddress')}
              errorMessage={<InputFieldError label={'This is not a valid email address.'} />}
              isValid={this.isValidEmail('emailAddress')}
              tooltipText={'This is an email address which we will send a reciept on payment of the invoice.'}
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
}

export default InvoiceLogin;
