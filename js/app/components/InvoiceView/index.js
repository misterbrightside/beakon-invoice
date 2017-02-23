import React, { Component, PropTypes } from 'react';
import InvoiceAPI from '../../api/InvoiceAPI';
import InvoiceContainer from '../InvoiceContainer/';
import IFrame from '../IFrame/';
import moment from 'moment';

class InvoiceView extends Component {

  static propTypes = {
    invoiceId: PropTypes.string.isRequired,
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
      .then(({ url }) => {
        this.setState({
          url,
          redirectToPaymentUrl: true,
          paymentSuccessPayload: null,
        });
      })
      .catch((error) => {
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
    InvoiceAPI.updatePaymentStatusOfInvoice(payload);
  }

  getResponseParameters = (url) => {
    const params = url.slice(url.indexOf('?') + 1).split('&');
    return Object.assign(...params.map((param) => {
      const [key, value] = param.split('=');
      return { [key]: value };
    }));
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

  getNotificationtext(isPaymentConfirmationNotifiction, invoiceStatusId, paymentSuccessPayload, dateOfAttemptedPayment) {
    if (!!paymentSuccessPayload && isPaymentConfirmationNotifiction) return `Success! You made a successful payment for this invoice ${moment(paymentSuccessPayload.DATETIME).format('LLLL')}.`;
    else if (!!paymentSuccessPayload && (paymentSuccessPayload.RESPONSECODE === 'D' || paymentSuccessPayload.RESPONSECODE === 'R')) return 'It seems there was an issue processing your payment. It may be an issue with your payment details. Please try again or contact support.';
    else if (invoiceStatusId === 'A') return `Success! There was a successful payment for this invoice ${moment(dateOfAttemptedPayment).format('LLLL')}.`
    return '';
  }

  getInvoiceView() {
    const { displayPaymentRedirectLoading } = this.state;
    const { paymentResponse, onClickClearState, dateOfAttemptedPayment } = this.props;
    const isPaymentConfirmationNotifiction = this.state.paymentSuccessPayload ? this.state.paymentSuccessPayload.RESPONSECODE === 'A' : false;
    const notificationText = this.getNotificationtext(isPaymentConfirmationNotifiction, paymentResponse.RESPONSECODE, this.state.paymentSuccessPayload, paymentResponse.DATETIME);
    return (
      <InvoiceContainer
        {...this.props}
        onPaymentButtonClick={this.onPaymentButtonClick}
        isBlurred={displayPaymentRedirectLoading}
        disablePayButton={paymentResponse.RESPONSECODE === 'A' || isPaymentConfirmationNotifiction }
        notificationText={notificationText}
        invoiceIssueDate={moment(paymentResponse.DATETIME, 'DD-MM-YYYY').format('MMMM Do YYYY')}
        onClickClearState={onClickClearState}
      />
    );
  }

  render() {
    const { redirectToPaymentUrl, paymentSuccessPayload } = this.state;
    const view = redirectToPaymentUrl && !paymentSuccessPayload ?
      this.getPaymentScreen() : this.getInvoiceView();
    return (
      view
    );
  }
}

export default InvoiceView;
