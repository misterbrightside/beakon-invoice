import React from 'react';
import style from './invoice-view.css';

const PrintButton = () => (<button>Print Invoice</button>);
const PayButton = () => (<button>Pay now</button>);
const LookupNewInvoiceButton = () => (<button>Look up new invoice</button>);

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
  <div>
    <LookupNewInvoiceButton />
    <PayButton />
    <PrintButton />
  </div>
);

const BottomActionButtons = () => (
  <div>
    <PayButton />
    <PrintButton />
  </div>
);

const Logo = () => (
  <div className={style.invoiceBusinessLogo}>
    <img src={'http://dundalkoil.beakon.ie/wp-content/uploads/2016/11/Logo.png'} />
  </div>
);

const BusinessAddress = () => (
  <div className={style.businessAddress}>
    <Logo />
    <address className={style.invoiceAddress}>
      <div>Dundalk Oil Products Limited,</div>
      <div>Brewer Business Park,</div>
      <div>Ardee Road, Co. Louth.</div>
    </address>
  </div>
);

const InvoiceMetaDetails = () => (
  <div className={style.invoiceMetaDetails}>
    <h2 className={style.invoiceHeader}>Invoice</h2>
    <div>Invoice # 293939</div>
    <div>1 Janurary 2020</div>
  </div>
);

const InvoiceHeader = () => (
  <div className={style.invoiceViewHeader}>
    <BusinessAddress />
    <InvoiceMetaDetails />
  </div>
);

const CustomerAddress = () => (
  <address className={style.invoiceAddress}>
    <div>
      <strong>Customer name</strong>
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

const Invoice = () => (
  <div className={style.invoiceView}>
    <InvoiceHeader />
    <CustomerAddress />
    <ItemsPurchased />
  </div>
);

const InvoiceView = () => (
  <div className={style.invoicesViewContainer}>
    <TopActionButtons />
    <Invoice />
    <BottomActionButtons />
  </div>
);

export default InvoiceView;
