import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import style from './invoice-view.css';
import buttonStyle from '../Button/button.css';
import InvoiceAPI from '../../api/InvoiceAPI';
import LoadingIndicator from '../LoadingIndicator/';


const RedirectToPaymentLoadingLayover = () => (
  <div className={style.overlay}>
    <LoadingIndicator />
    <div>Loading Payment Gateway</div>
    <div>Redirecting you to WorldNet...</div>
  </div>
);

const PrintButton = () => (<button className={buttonStyle.secondary}>Print Invoice</button>);

const PayButton = ({ onPaymentButtonClick }) => (
  <button
    className={buttonStyle.primary}
    onClick={onPaymentButtonClick}
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

const TopActionButtons = ({ onPaymentButtonClick }) => (
  <div className={buttonStyle.spaceBetween}>
    <div>
      <LookupNewInvoiceButton />
    </div>
    <div className={buttonStyle.spaceButtons}>
      <PrintButton />
      <PayButton
        onPaymentButtonClick={onPaymentButtonClick}
      />
    </div>
  </div>
);

const BottomActionButtons = ({ onPaymentButtonClick }) => (
  <div className={buttonStyle.spaceBetween}>
    <div />
    <div className={buttonStyle.spaceButtons}>
      <PrintButton />
      <PayButton
        onPaymentButtonClick={onPaymentButtonClick}
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

const InvoiceMetaDetails = ({ invoiceId }) => (
  <div className={style.invoiceMetaDetails}>
    <h2 className={style.invoiceHeader}>Invoice</h2>
    <div>Invoice # { invoiceId }</div>
    <div>1 Janurary 2020</div>
  </div>
);

const InvoiceHeader = ({ invoiceId }) => (
  <div className={style.invoiceViewHeader}>
    <BusinessAddress
      inline={false}
      displayLogo={true}
    />
    <InvoiceMetaDetails
      invoiceId={invoiceId}
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

const Invoice = (props) => {
  const { 
    firstNameId,
    surnameId,
    addressLine1Id,
    addressLine2Id,
    addressLine3Id,
    invoiceId,
  } = props;
  return (
    <div className={style.invoiceView}>
      <InvoiceHeader
        invoiceId={invoiceId}
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

class InvoiceView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayPaymentRedirectLoading: false,
      url: '',
    };
  }

  onPaymentButtonClick = () => {
    const { invoiceId } = this.props;
    this.setState({ displayPaymentRedirectLoading: true });
    InvoiceAPI.getURLForWorldNetPayment(invoiceId)
      .then(paymentDetails => {
        const url = InvoiceAPI.redirectToPaymentUrl(paymentDetails);
        this.setState({ url });
      })
      .catch(x => {
        console.error(x, 'we failed captn');
        this.setState({ displayPaymentRedirectLoading: false });
      });
  }

  getInvoice() {
    return (
      <div className={style.invoicesViewContainer}>
        <TopActionButtons
          onPaymentButtonClick={this.onPaymentButtonClick}
        />
        <Invoice
          {... this.props}
        />
        <BottomActionButtons
          onPaymentButtonClick={this.onPaymentButtonClick}
        />
      </div>
    );
  }

  getInvoiceVoice() {
    const invoice = this.getInvoice();
    const { displayPaymentRedirectLoading } = this.state;
    const isBlurred = displayPaymentRedirectLoading ? style.blurred : '';
    return (
      <div>
        <div className={isBlurred}>
          <ReactCSSTransitionGroup
            transitionName="displayInvoice"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={false}
            transitionLeave={false}
          >
            { invoice }
          </ReactCSSTransitionGroup>
        </div>
        { displayPaymentRedirectLoading ? <RedirectToPaymentLoadingLayover /> : null }
      </div>
    );
  }

  getPaymentScreen() {
    const { url } = this.state;
    return (
      <iframe
        src={url}
        frameBorder={'0'}
      />
    );
  }

  render() {
    const { url } = this.state;
    const view = url ? this.getPaymentScreen() : this.getInvoiceVoice();
    return (
      view
    );
  }
}

export default InvoiceView;
