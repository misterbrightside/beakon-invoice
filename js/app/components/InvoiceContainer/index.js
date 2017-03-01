import React, { Component, PropTypes } from 'react';
import buttonStyle from '../Button/button.css';
import LoadingIndicator from '../LoadingIndicator/';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Alert from '../Alert/';
import style from './invoice-view.css';
import { uniqueId } from 'lodash';
import Invoice from './Invoice';

const RedirectToPaymentLoadingLayover = () => (
  <div className={style.overlay}>
    <LoadingIndicator />
    <div>Loading Payment Gateway</div>
    <div>Redirecting you to WorldNet...</div>
  </div>
);

const printInvoice = () => {
  window.print();
};

const PrintButton = ({ onClickPrint }) => (
  <button
    className={buttonStyle.secondary}
    onClick={printInvoice}
  >
    Print Invoice
  </button>);

const PayButton = ({ onPaymentButtonClick, disabled }) => (
  <button
    className={buttonStyle.primary}
    onClick={onPaymentButtonClick}
    disabled={disabled}
  >
    Pay now
  </button>
);

const LookupNewInvoiceButton = ({ onClickClearState }) => (
  <button
    className={buttonStyle.secondary}
    onClick={onClickClearState}
  >
    Look up new invoice
  </button>
);

const TopActionButtons = ({ onPaymentButtonClick, disablePayButton, onClickPrint, onClickClearState }) => (
  <div className={buttonStyle.spaceBetween}>
    <div>
      <LookupNewInvoiceButton
        onClickClearState={onClickClearState}
      />
    </div>
    <div className={buttonStyle.spaceButtons}>
      <PrintButton
        onClickPrint={onClickPrint}
      />
      <PayButton
        onPaymentButtonClick={onPaymentButtonClick}
        disabled={disablePayButton}
      />
    </div>
  </div>
);

const BottomActionButtons = ({ onPaymentButtonClick, disablePayButton }) => (
  <div className={buttonStyle.spaceBetween}>
    <div />
    <div className={buttonStyle.spaceButtons}>
      <PrintButton />
      <PayButton
        onPaymentButtonClick={onPaymentButtonClick}
        disabled={disablePayButton}
      />
    </div>
  </div>
);

const PaidNotification = ({ text }) => (
  <div>
    <Alert alertType={'info'}>
      { text }
    </Alert>
  </div>
);

class InvoiceContainer extends Component {

  static propTypes = {
    isBlurred: PropTypes.bool,
    onPaymentButtonClick: PropTypes.func.isRequired,
    disablePayButton: PropTypes.bool,
  };

  render() {
    const { isBlurred, onPaymentButtonClick, disablePayButton, onClickClearState, notificationText, getInvoiceMarkup } = this.props;
    const blurStyle = isBlurred ? style.blurred : '';
    return (
      <div>
        <div className={blurStyle}>
          <ReactCSSTransitionGroup
            transitionName="displayInvoice"
            transitionAppear
            transitionAppearTimeout={500}
            transitionLeaveTimeout={500}
            transitionEnter={false}
            transitionLeave
          >
            <div className={style.invoicesViewContainer}>
              <TopActionButtons
                onPaymentButtonClick={onPaymentButtonClick}
                onClickPrint={getInvoiceMarkup}
                disablePayButton={disablePayButton}
                onClickClearState={onClickClearState}
              />
              { disablePayButton ? <PaidNotification text={notificationText} /> : null}
              <Invoice
                { ...this.props }
              />
              <BottomActionButtons
                onPaymentButtonClick={onPaymentButtonClick}
                disablePayButton={disablePayButton}
              />
            </div>
          </ReactCSSTransitionGroup>
        </div>
        { isBlurred ? <RedirectToPaymentLoadingLayover /> : null }
      </div>
    );
  }
}

export default InvoiceContainer;