import React, { Component, PropTypes } from 'react';
import InvoiceAPI from '../../api/InvoiceAPI';
import InvoiceContainer from '../InvoiceContainer/';
import IFrame from '../IFrame/';
import moment from 'moment';

class InvoiceView extends Component {

  static propTypes = {
    invoiceId: PropTypes.string.isRequired,
    invoiceStatusId: PropTypes.string,
  };

  static defaultProps = {
    invoiceStatusId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      displayPaymentRedirectLoading: false,
      redirectToPaymentUrl: false,
      url: '',
      paymentSuccessPayload: null,
    };
  }

  onPaymentButtonClick = () =>  {
    const { number } = this.props;
    this.setState({ displayPaymentRedirectLoading: true });
    InvoiceAPI.getURLForWorldNetPayment(number)
      .then((paymentDetails) => {
        const url = InvoiceAPI.redirectToPaymentUrl(paymentDetails);
        this.setState({
          url,
          redirectToPaymentUrl: true,
          paymentSuccessPayload: null,
        });
      })
      .catch((error) => {
        console.error(error, 'we failed captn');
        this.setState({
          displayPaymentRedirectLoading: false,
          redirectToPaymentUrl: false,
          paymentSuccessPayload: null,
        });
      });
  }

  onPaymentAttempt = (event) => {
    const { href } = event.target.contentWindow.location;
    const payload = this.getResponseParameters(href);
    this.setState({
      paymentSuccessPayload: payload,
      displayPaymentRedirectLoading: false,
      redirectToPaymentUrl: false,
    });
    InvoiceAPI.updatePaymentStatusOfInvoice(payload)
      .then(data => console.log(data));
  }

  getResponseParameters = (url) => {
    const params = url.slice(url.indexOf('?') + 1).split('&');
    return Object.assign(...params.map((param) => {
      const [key, value] = param.split('=');
      return { [key]: value };
    }));
  }

  getReceiptConfirmationScreen() {
    const { paymentSuccessPayload } = this.state;
    return (
      <div>Thx this is paid { JSON.stringify(paymentSuccessPayload) }</div>
    );
  }

  getPaymentScreen() {
    const { url } = this.state;
    return (
      <IFrame
        src={url}
        maybeOnLoad={this.onPaymentAttempt}
      />
    );
  }

  getInvoiceView() {
    const { displayPaymentRedirectLoading } = this.state;
    const { invoiceStatusId, invoiceDateIssuedId, onClickClearState } = this.props;
    return (
      <InvoiceContainer
        {...this.props}
        onPaymentButtonClick={this.onPaymentButtonClick}
        isBlurred={displayPaymentRedirectLoading}
        disablePayButton={invoiceStatusId === 'A'}
        invoiceIssueDate={moment(invoiceDateIssuedId, 'DD-MM-YYYY').format('MMMM Do YYYY')}
        onClickClearState={onClickClearState}
      />
    );
  }

  render() {
    const { redirectToPaymentUrl, paymentSuccessPayload } = this.state;
    if (paymentSuccessPayload) {
      return this.getReceiptConfirmationScreen();
    }
    const view = redirectToPaymentUrl && !paymentSuccessPayload ?
      this.getPaymentScreen() : this.getInvoiceView();
    return (
      view
    );
  }
}

export default InvoiceView;
