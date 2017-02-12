import React, { Component, PropTypes } from 'react';
import buttonStyle from '../Button/button.css';
import LoadingIndicator from '../LoadingIndicator/';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Alert from '../Alert/';
import style from './invoice-view.css';

const RedirectToPaymentLoadingLayover = () => (
  <div className={style.overlay}>
    <LoadingIndicator />
    <div>Loading Payment Gateway</div>
    <div>Redirecting you to WorldNet...</div>
  </div>
);

const PrintButton = () => (<button className={buttonStyle.secondary}>Print Invoice</button>);

const PayButton = ({ onPaymentButtonClick, disabled }) => (
  <button
    className={buttonStyle.primary}
    onClick={onPaymentButtonClick}
    disabled={disabled}
  >
    Pay now
  </button>
);

const LookupNewInvoiceButton = () => (
  <button className={buttonStyle.secondary}>Look up new invoice</button>
);

const getRow = (index, data) => (
  <tr key={index} className={style.invoiceItemTableRow}>
    { data.map(value => (
      <td
        key={`todo-${value}`}
        className={style.invoiceItemCell}
      >{value}</td>),
    ) }
  </tr>
);

const TopActionButtons = ({ onPaymentButtonClick, disablePayButton }) => (
  <div className={buttonStyle.spaceBetween}>
    <div>
      <LookupNewInvoiceButton />
    </div>
    <div className={buttonStyle.spaceButtons}>
      <PrintButton />
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

const Logo = () => (
  <div className={style.invoiceBusinessLogo}>
    <img src={'http://dundalkoil.beakon.ie/wp-content/uploads/2016/11/Logo.png'} />
  </div>
);

const BusinessAddress = ({ inline, displayLogo }) => {
  const address = ['Dundalk Oil Products Limited,', 'Brewer Business Park,', 'Ardee Road, Co. Louth.'];
  return (
    <div className={style.businessAddress}>
      { displayLogo ? <Logo /> : null }
      <address className={style.invoiceAddress}>
        {
          inline ?
            address.map(addressLine => <span>{ addressLine }</span>) :
            address.map(addressLine => <div>{ addressLine }</div>)
        }
      </address>
    </div>
  );
};

const InvoiceMetaDetails = ({ invoiceId, invoiceIssueDate }) => (
  <div className={style.invoiceMetaDetails}>
    <h2 className={style.invoiceHeader}>Invoice</h2>
    <div>Invoice # { invoiceId }</div>
    <div>{ invoiceIssueDate }</div>
  </div>
);

const InvoiceHeader = ({ invoiceId, invoiceIssueDate }) => (
  <div className={style.invoiceViewHeader}>
    <BusinessAddress
      inline={false}
      displayLogo={true}
    />
    <InvoiceMetaDetails
      invoiceId={invoiceId}
      invoiceIssueDate={invoiceIssueDate}
    />
  </div>
);

const CustomerAddress = ({ firstName, surname, addressLine1, addressLine2, addressLine3 }) => (
  <address className={`${style.invoiceAddress} ${style.customerAddress}`}>
    <div>
      <strong>{firstName} {surname}</strong>
    </div>
    <div>{addressLine1}</div>
    <div>{addressLine2}</div>
    <div>{addressLine3}</div>
  </address>
);

const ItemsTotal = () => (
  <tfoot className={style.invoicesFooter}>
    { getRow(1, ['', 'Subtotal', '€349.47']) }
    { getRow(2, ['', 'VAT', '€34.95']) }
    { getRow(3, ['', 'Total', '€349.47']) }
  </tfoot>
);

const Items = () => (
  <tbody className={style.invoiceTableBody}>
    { getRow(5, ['Kerosene', 500, '€349sss.47']) }
    { getRow(10220, ['Kerosene', 500, '€34ssza9sss.47']) }
  </tbody>
);

const TableHeader = () => (
  <thead>
    <tr className={style.invoiceItemTableRow}>
      <th className={style.invoiceItemCell}>Line Items</th>
      <th className={style.invoiceItemCell}>Quantity</th>
      <th className={style.invoiceItemCell}>Amount</th>
    </tr>
  </thead>
);

const ItemsPurchased = () => (
  <table className={style.invoiceItemsTable}>
    <TableHeader />
    <Items />
    <ItemsTotal />
  </table>
);

const BusinessInfo = () => (
  <div className={style.businessInfo}>
    <div className={style.companyInfo}>Company Registration Number: 123456P | VAT No. 1234567</div>
    <BusinessAddress
      inline={true}
      displayLogo={false}
    />
  </div>
);

const PaidNotification = () => (
  <div>
    <Alert alertType={'info'}>
      There was a payment attempt for this invoice at { new Date().toString() }.
    </Alert>
  </div>
);

const Invoice = (props) => {
  const {
    firstNameId,
    surnameId,
    addressLine1Id,
    addressLine2Id,
    addressLine3Id,
    invoiceId,
    invoiceIssueDate,
  } = props;
  return (
    <div className={style.invoiceView}>
      <InvoiceHeader
        invoiceId={invoiceId}
        invoiceIssueDate={invoiceIssueDate}
      />
      <CustomerAddress
        firstName={firstNameId}
        surname={surnameId}
        addressLine1={addressLine1Id}
        addressLine2={addressLine2Id}
        addressLine3={addressLine3Id}
      />
      <ItemsPurchased />
      <BusinessInfo />
    </div>
  );
};

class InvoiceContainer extends Component {

  static propTypes = {
    isBlurred: PropTypes.bool,
    onPaymentButtonClick: PropTypes.func.isRequired,
    disablePayButton: PropTypes.bool,
  };

  render() {
    const { isBlurred, onPaymentButtonClick, disablePayButton } = this.props;
    const blurStyle = isBlurred ? style.blurred : '';
    return (
      <div>
        <div className={blurStyle}>
          <ReactCSSTransitionGroup
            transitionName="displayInvoice"
            transitionAppear
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
          >
            <div className={style.invoicesViewContainer}>
              <TopActionButtons
                onPaymentButtonClick={onPaymentButtonClick}
                disablePayButton={disablePayButton}
              />
              { disablePayButton ? <PaidNotification /> : null}
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