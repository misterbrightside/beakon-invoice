import React, { Component, PropTypes } from 'react';
import buttonStyle from '../Button/button.css';
import LoadingIndicator from '../LoadingIndicator/';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Alert from '../Alert/';
import style from './invoice-view.css';
import { round } from 'lodash';

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

const PrintButton = () => (
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

const getRow = (index, data) => (
  <tr key={index} className={style.invoiceItemTableRow}>
    { data.map(value => (
      <td
        key={`item-in-invoice-${value}`}
        className={style.invoiceItemCell}
      >{value}</td>),
    ) }
  </tr>
);

const TopActionButtons = ({ onPaymentButtonClick, disablePayButton, onClickClearState }) => (
  <div className={buttonStyle.spaceBetween}>
    <div>
      <LookupNewInvoiceButton
        onClickClearState={onClickClearState}
      />
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

const CustomerAddress = ({ name, address1, address2, address3, address4, address5, address6 }) => (
  <address className={`${style.invoiceAddress} ${style.customerAddress}`}>
    <div>
      <strong>{ name }</strong>
    </div>
    { address1 ? <div>{ address1 },</div> : null }
    { address2 ? <div>{ address2 },</div> : null }
    { address3 ? <div>{ address3 },</div> : null }
    { address4 ? <div>{ address4 },</div> : null }
    { address5 ? <div>{ address5 },</div> : null }
    { address6 ? <div>{ address6 } </div> : null }
  </address>
);

const ItemsTotal = ({ subTotal, VAT, total }) => (
  <tfoot className={style.invoicesFooter}>
    { getRow(1, ['', 'Subtotal', `€${subTotal}`]) }
    { getRow(2, ['', 'VAT', `€${VAT}`]) }
    { getRow(3, ['', 'Total', `€${total}`]) }
  </tfoot>
);

const Items = ({ items }) => (
  <tbody className={style.invoiceTableBody}>
    { items.map((item, index) => getRow(`'item-${index}`, [item.name, round(item.qty, 2), `€${ round(item.qty * item.salePrice, 2) }`] )) }
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

const ItemsPurchased = ({ items }) => {
  const subTotal = Object.keys(items).reduce((previous, key) => {
    const price = parseFloat(items[key].amountVatExc, 10);
    return previous + price;
  }, 0);
  const subTotalRounded = round(subTotal, 2);
  const VAT = Object.keys(items).reduce((previous, key) => {
    const vatAmount = parseFloat(items[key].vatAmount, 10);
    return previous + vatAmount;
  }, 0);
  const totalBmu = Object.keys(items).reduce((previous, key) => {
    const quantity = parseFloat(items[key].qty, 10);
    const bmu = parseFloat(items[key].costPriceBmu, 10);
    return previous + (quantity * bmu);
  }, 0);
  const total = round(totalBmu, 2);
  return (
    <table className={style.invoiceItemsTable}>
      <TableHeader />
      <Items
        items={items}
      />
      <ItemsTotal
        subTotal={subTotalRounded}
        VAT={VAT}
        total={total}
      />
    </table>
  );
}

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
    number: invoiceId,
    postDate: invoiceIssueDate,
    items,
    customer,
  } = props;
  return (
    <div className={style.invoiceView} id={'this-invoice'}>
      <InvoiceHeader
        invoiceId={invoiceId}
        invoiceIssueDate={invoiceIssueDate}
      />
      <CustomerAddress
        {...customer}
      />
      <ItemsPurchased
        items={items}
      />
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
    const { isBlurred, onPaymentButtonClick, disablePayButton, onClickClearState } = this.props;
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
                disablePayButton={disablePayButton}
                onClickClearState={onClickClearState}
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