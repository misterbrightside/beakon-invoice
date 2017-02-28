import React, { Component, PropTypes } from 'react';
import buttonStyle from '../Button/button.css';
import LoadingIndicator from '../LoadingIndicator/';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Alert from '../Alert/';
import style from './invoice-view.css';
import { round, uniqueId } from 'lodash';

import ReactDOMServer from 'react-dom/server';

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

const getRow = (index, data) => (
  <tr key={index} className={style.invoiceItemTableRow}>
    { data.map(value => (
      <td
        key={uniqueId()}
        className={style.invoiceItemCell}
      >{value}</td>),
    ) }
  </tr>
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

const Logo = () => (
  <div className={style.invoiceBusinessLogo}>
    <img src={'http://dundalkoil.beakon.ie/wp-content/uploads/2016/11/Logo.png'} />
  </div>
);

const BusinessAddress = ({ inline, displayLogo, children }) => {
  const address = ['Dundalk Oil Products Limited,', 'Brewer Business Park,', 'Ardee Road, Co. Louth.'];
  return (
    <div className={style.businessAddress}>
      { displayLogo ? <Logo /> : null }
      <address className={`${style.invoiceAddress} ${inline ? '' : style.blockAddress}`}>
        {
          inline ?
            address.map(addressLine => <span>{ addressLine }</span>) :
            address.map(addressLine => <div>{ addressLine }</div>)
        }
        { children }
      </address>
    </div>
  );
};

const InvoiceMetaDetails = ({ invoiceId, remark, reference, invoiceIssueDate }) => (
  <div className={style.invoiceMetaDetails}>
    <h2 className={style.invoiceHeader}>Invoice</h2>
    <div>Invoice Number - { invoiceId }</div>
    { remark ? <div>{ remark }</div> : null }
    { reference ? <div>Reference - {reference}</div> : null }
    <div>Invoice Date - { invoiceIssueDate }</div>
  </div>
);

const InvoiceHeader = ({ invoiceId, remark, reference, invoiceIssueDate }) => (
  <div className={style.invoiceViewHeader}>
    <BusinessAddress
      inline={false}
      displayLogo={true}
    >
       <strong>Licence Number</strong> AFTL DK058C MFTL 1005057
    </BusinessAddress>
    <InvoiceMetaDetails
      invoiceId={invoiceId}
      remark={remark}
      reference={reference}
      invoiceIssueDate={invoiceIssueDate}
    />
  </div>
);

const CustomerAddress = ({ name, ...address }) => (
  <address className={`${style.invoiceAddress} ${style.customerAddress}`}>
    <div>
      <strong>{ name }</strong>
    </div>
    { Object.keys(address).map(addressKey => address[addressKey] ? <div>{ address[addressKey] }</div> : null) }
  </address>
);

const ItemsTotal = ({ subTotal, VAT, total }) => {
  const totalCost = <span className={style.totalCost}>{`€${total}`}</span>;
  return (
    <tfoot className={style.invoicesFooter}>
      { getRow(1, ['', '', '', '', 'Subtotal', `€${subTotal}`]) }
      { getRow(2, ['', '', '', '', 'VAT', `€${VAT}`]) }
      { getRow(3, ['', '', '', '', <span className={style.totalString}>Total</span>, totalCost]) }
      { getRow(4, ['', '', '', '', <span className={style.totalString}>Paid</span>, `€0`]) }
      { getRow(5, ['', '', '', '', <span className={style.totalString}>Outstanding</span>, `€0`])}
    </tfoot>
  );
};

const Items = ({ items }) => {
  return (
    <tbody className={style.invoiceTableBody}>
      { items.map((item, index) => getRow(`'item-${index}`, [item.name, item.qty, `€${item.salePrice}`, `€${item.amountVatExc}`, `€${item.vatAmount}`, `€${round(parseFloat(item.qty, 10) * parseFloat(item.salePriceVatInclusive, 10), 2)}`] )) }
    </tbody>
  )
};

const TableHeader = () => (
  <thead>
    <tr className={style.invoiceItemTableRow}>
      <th className={style.invoiceItemCell}>Name/Description</th>
      <th className={style.invoiceItemCell}>Quantity</th>
      <th className={style.invoiceItemCell}>Price per unit (Ex. VAT)</th>
      <th className={style.invoiceItemCell}>Price (Ex. VAT)</th>
      <th className={style.invoiceItemCell}>VAT</th>
      <th className={style.invoiceItemCell}>Price (Inc. VAT)</th>
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
    const vatAmount = parseFloat(items[key].vatAmount, 10);
    const price = parseFloat(items[key].amountVatExc, 10);
    return previous + (vatAmount + price);
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
    <div className={style.companyInfo}>Company Registration Number: 171780 | VAT No. IE 6571780U</div>
    <BusinessAddress
      inline={true}
      displayLogo={false}
    />
    <div>Email: <a href='mailto:sales@dundalkoil.com'>sales@dundalkoil.com</a>  | Phone: 042 933 4081 | Web: <a href='http://www.dundalkoil.ie'>dundalkoil.ie</a></div>
    <div>Dundalk Oil Products deliver only the highest quality Texaco fuels.</div>
    <div><img className={style.smallImage} src='http://dundalkoil.beakon.ie/wp-content/uploads/2017/02/texaco-logo-1.png' /></div>
  </div>
);

const PaidNotification = ({ text }) => (
  <div>
    <Alert alertType={'info'}>
      { text }
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
    remark,
    reference
  } = props;
  return (
    <div className={style.invoiceView} id={'this-invoice'}>
      <InvoiceHeader
        invoiceId={invoiceId}
        invoiceIssueDate={invoiceIssueDate}
        remark={remark}
        reference={reference}
      />
      <CustomerAddress
        name={customer.name}
        address1={customer.address1}
        address2={customer.address2}
        address3={customer.address3}
        address4={customer.address4}
        address5={customer.address5}
        address5={customer.address5}
        address6={customer.address6}
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

  onClickPrint = () => {
    const markup = ReactDOMServer.renderToStaticMarkup(<Invoice {...this.props} />);
  }

  render() {
    const { isBlurred, onPaymentButtonClick, disablePayButton, onClickClearState, notificationText } = this.props;
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
                onClickPrint={this.onClickPrint}
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