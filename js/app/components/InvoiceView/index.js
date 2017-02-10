import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import style from './invoice-view.css';
import buttonStyle from '../Button/button.css';

const PrintButton = () => (<button className={buttonStyle.secondary}>Print Invoice</button>);
const PayButton = () => (<button className={buttonStyle.primary}>Pay now</button>);
const LookupNewInvoiceButton = () => (
  <button className={buttonStyle.secondary}>Look up new invoice</button>
);

const getRow = (index, data) => (
  <tr key={index} className={style.invoiceItemTableRow}>
    { data.map((value, key) => (
      <td
        key={key}
        className={style.invoiceItemCell}
      >{value}</td>)
    ) }
  </tr>
);

const TopActionButtons = () => (
  <div className={buttonStyle.spaceBetween}>
    <div>
      <LookupNewInvoiceButton />
    </div>
    <div className={buttonStyle.spaceButtons}>
      <PrintButton />
      <PayButton />
    </div>
  </div>
);

const BottomActionButtons = () => (
  <div className={buttonStyle.spaceBetween}>
    <div />
    <div className={buttonStyle.spaceButtons}>
      <PrintButton />
      <PayButton />
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

const InvoiceMetaDetails = () => (
  <div className={style.invoiceMetaDetails}>
    <h2 className={style.invoiceHeader}>Invoice</h2>
    <div>Invoice # 293939</div>
    <div>1 Janurary 2020</div>
  </div>
);

const InvoiceHeader = () => (
  <div className={style.invoiceViewHeader}>
    <BusinessAddress
      inline={false}
      displayLogo={true}
    />
    <InvoiceMetaDetails />
  </div>
);

const CustomerAddress = ({ firstName, surname }) => (
  <address className={`${style.invoiceAddress} ${style.customerAddress}`}>
    <div>
      <strong>{firstName} {surname}</strong>
    </div>
    <div>Address Line 1</div>
    <div>Address Line 2</div>
    <div>Address Line 3</div>
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

const Invoice = (props) => {
  const { firstNameId, surnameId } = props;
  return (
    <div className={style.invoiceView}>
      <InvoiceHeader />
      <CustomerAddress
        firstName={firstNameId}
        surname={surnameId}
      />
      <ItemsPurchased />
      <BusinessInfo />
    </div>
  );
};

class InvoiceView extends Component {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="displayInvoice"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        <div className={style.invoicesViewContainer}>
          <TopActionButtons />
          <Invoice {... this.props} />
          <BottomActionButtons />
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}

export default InvoiceView;
