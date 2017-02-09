import React from 'react';
import style from './invoice-view.css';

const PrintButton = () => (<button>Print Invoice</button>);
const PayButton = () => (<button>Pay now</button>);
const LookupNewInvoiceButton = () => (<button>Look up new invoice</button>);

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
  <div>Logo goes here, hunty.</div>
);

const BusinessAddress = () => (
  <div className={style.businessAddress}>
    <Logo />
    <address>
      Dundalk Oil Products Limited,
      Brewer Business Park,
      Ardee Road, Co. Louth.
    </address>
  </div>
);

const InvoiceMetaDetails = () => (
  <div className={style.invoiceMetaDetails}>
    <h2>Invoice</h2>
    <div>Invoice number 293939</div>
    <div>1st Jan 2020</div>
  </div>
);

const InvoiceHeader = () => (
  <div className={style.invoiceViewHeader}>
    <BusinessAddress />
    <InvoiceMetaDetails />
  </div>
);

const CustomerAddress = () => (
  <address>
    <div>
      <strong>Customer name</strong>
    </div>
    <div>Address Line 1</div>
    <div>Address Line 2</div>
    <div>Address Line 3</div>
  </address>
);

const ItemsTotal = () => (
  <tfoot>
    <tr>
      <td />
      <td>Subtotal</td>
      <td>$180</td>
    </tr>
    <tr>
      <td />
      <td>VAT</td>
      <td>$180</td>
    </tr>
    <tr>
      <td />
      <td>Total</td>
      <td>$180</td>
    </tr>
  </tfoot>
);

const Items = () => (
  <tbody>
    <tr>
      <td>USA</td>
      <td>robot D.C.</td>
      <td>309 million</td>
    </tr>
    <tr>
      <td>Sweden</td>
      <td>Stockholm</td>
      <td>9 million</td>
    </tr>
  </tbody>
);

const TableHeader = () => (
  <thead>
    <tr>
      <th>Line Items</th>
      <th>Quantity</th>
      <th>Amount</th>
    </tr>
  </thead>
);

const ItemsPurchased = () => (
  <table>
    <TableHeader />
    <Items />
    <ItemsTotal />
  </table>
);

const Invoice = () => (
  <div>
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
