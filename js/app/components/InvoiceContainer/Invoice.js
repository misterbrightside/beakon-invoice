import React, { Component, PropTypes } from 'react';
import style from './invoice-view.css';
import { round, uniqueId } from 'lodash';

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
            address.map(addressLine => <span key={uniqueId()}>{ addressLine }</span>) :
            address.map(addressLine => <div key={uniqueId()}>{ addressLine }</div>)
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
    { Object.keys(address).map(addressKey => address[addressKey] ? <div key={uniqueId()}>{ address[addressKey] }</div> : null) }
  </address>
);

const ItemsTotal = ({ subTotal, VAT, total, paid, outstanding }) => {
  const totalCost = <span className={style.totalCost}>{`€${total}`}</span>;
  return (
    <tfoot className={style.invoicesFooter}>
      { getRow(1, ['', '', '', '', 'Subtotal', `€${subTotal}`]) }
      { getRow(2, ['', '', '', '', 'VAT', `€${VAT}`]) }
      { getRow(3, ['', '', '', '', <span className={style.totalString}>Total</span>, totalCost]) }
      { getRow(4, ['', '', '', '', <span className={style.totalString}>Paid</span>, `€${paid}`]) }
      { getRow(5, ['', '', '', '', <span className={style.totalString}>Outstanding</span>, `€${outstanding}`])}
    </tfoot>
  );
};

const Items = ({ items, outstanding, paid }) => {
  return (
    <tbody className={style.invoiceTableBody}>
      { items.map((item, index) => getRow(uniqueId(), [
          item.NAME,
          item.QUANTITY,
          `€${item.FRGSALEPRICE}`,
          `€${item.FRGAMOUNTVATEXC}`,
          `€${item.FRGVATAMOUNT}`,
          `€${round(parseFloat(item.FRGAMOUNTVATEXC, 10) + parseFloat(item.FRGVATAMOUNT, 10), 2)}`
        ])
      )}
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

const ItemsPurchased = ({ items, paid, outstanding }) => {
  const subTotal = Object.keys(items).reduce((previous, key) => {
    const price = parseFloat(items[key].FRGAMOUNTVATEXC, 10);
    return previous + price;
  }, 0);
  const subTotalRounded = round(subTotal, 2);
  const VAT = Object.keys(items).reduce((previous, key) => {
    const vatAmount = parseFloat(items[key].FRGVATAMOUNT, 10);
    return previous + vatAmount;
  }, 0);
  const VATRounded = round(VAT, 2);
  const total = round(subTotal + VAT, 2);
  const totalPaid = outstanding === 0 ? total : paid;
  return (
    <div className={style.tableWrapper}>
      <table className={style.invoiceItemsTable}>
        <TableHeader />
        <Items
          items={items}
        />
        <ItemsTotal
          subTotal={subTotalRounded}
          VAT={VATRounded}
          total={total}
          paid={totalPaid}
          outstanding={outstanding}
        />
      </table>
    </div>
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

const Invoice = (props) => {
  const {
    firstNameId,
    surnameId,
    saleDoc,
    items,
    customer,
    reference,
    total,
    paid,
    leftToPay,
    paymentSuccessPayload
  } = props;

  const totalLeftToPay = paymentSuccessPayload !== null && paymentSuccessPayload.AMOUNT ? parseFloat(leftToPay, 10) - parseFloat(paymentSuccessPayload.AMOUNT, 10) : parseFloat(leftToPay, 10);
  const totalPaid = paymentSuccessPayload !== null && paymentSuccessPayload.AMOUNT ? parseFloat(paid, 10) + parseFloat(paymentSuccessPayload.AMOUNT, 10) : parseFloat(paid, 10);
  return (
    <div className={style.invoiceView} id={'this-invoice'}>
      <InvoiceHeader
        invoiceId={saleDoc.NUMBER}
        invoiceIssueDate={saleDoc.POSTDATE}
        remark={saleDoc.REMARKS}
        reference={saleDoc.REFERENCE}
      />
      <CustomerAddress
        name={customer.NAME}
        address1={customer.ADDRLINE01}
        address2={customer.ADDRLINE02}
        address3={customer.ADDRLINE03}
        address4={customer.ADDRLINE04}
        address5={customer.ADDRLINE05}
        address6={customer.ADDRLINE06}
      />
      <ItemsPurchased
        items={items}
        paid={totalPaid}
        outstanding={totalLeftToPay}
      />
      <BusinessInfo />
    </div>
  );
};

export default Invoice;