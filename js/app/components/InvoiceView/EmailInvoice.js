import React, { Component, PropTypes } from 'react';
import Invoice from '../InvoiceContainer/Invoice';
import { round, uniqueId } from 'lodash';

const style =  { 
	invoiceBox: {
        maxWidth: '800px',
        margin: 'auto',
        padding: '30px',
        border: '1px solid #eee',
        boxShadow: '0 0 10px rgba(0, 0, 0, .15)',
        fontSize: '16px',
        lineHeight: '24px',
        fontFamily: "'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif",
        color: "#555",
    },

    fullWidthTable: {
    	width: '100%',
    	lineHeight: 'inherit',
        textAlign: 'left'
    },

    invoiceBoxTableTd: {
        padding: '5px',
        verticalAlign: 'top',
    },

    textAlignRight: {
    	textAlign: 'right'
    },

    invoiceHeader: {
		fontSize: '2.75em',
		color: '#e52025',
		textTransform: 'uppercase',
		fontWeight: 900,
		textAlign: 'right'
	},

	address: {
		paddingTop: '30px',
		paddingBottom: '15px',
		fontStyle: 'normal',
	},

	cellFirst: {
		padding: '10px 150px 10px 10px',
		border: '1px solid #939495'
	},

	cellHeader: {
		textAlign: 'center',
		border: '1px solid #939495'
	},

	cell: {
		padding: '10px 20px',
		textAlign: 'center',
		border: '1px solid #939495'
	},

	invoiceItemsTable: {
		borderCollapse: 'collapse'
	}
}

const Logo = () => (
  	<td className="title">
    	<img 
    		src={'http://dundalkoil.beakon.ie/wp-content/uploads/2016/11/Logo.png'} 
			  style={{width:'100%', maxWidth:'300px'}}
    	/>
	</td>
);


const InvoiceMetaDetails = ({ invoiceId, remark, reference, invoiceIssueDate }) => (
  <td style={style.textAlignRight}>
    <h2 style={style.invoiceHeader}>Invoice</h2>
    <div>Invoice Number - { invoiceId }</div>
    { remark ? <div>{ remark }</div> : null }
    { reference ? <div>Reference - {reference}</div> : null }
    <div>Invoice Date - { invoiceIssueDate }</div>
  </td>
);

const CustomerAddress = ({ name, ...address }) => (
  <div style={style.address}>
    <div>
      <strong>{ name }</strong>
    </div>
    { Object.keys(address).map(addressKey => address[addressKey] ? <div key={uniqueId()}>{ address[addressKey] }</div> : null) }
  </div>
);

const BusinessAddress = ({ inline, displayLogo, children }) => {
  const address = ['Dundalk Oil Products Limited,', 'Brewer Business Park,', 'Ardee Road, Co. Louth.'];
  return (
      <div>
        {
          inline ?
            address.map(addressLine => <span key={uniqueId()}>{ addressLine }</span>) :
            address.map(addressLine => <div key={uniqueId()}>{ addressLine }</div>)
        }
        { children }
      </div>
  );
};

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

const getRow = (index, data) => {
	const [head, ...cells] = data;
  return (
  	<tr key={index} className={style.invoiceItemTableRow}>
  	{ <td key={uniqueId()} style={head ? style.cellFirst : {}}>{head}</td> }
    { cells.map(value => (
      <td
        key={uniqueId()}
        style={value ? style.cell : {}}
      >{value}</td>)
    ) }
  </tr>
  );
};

const TableHeader = () => (
  <thead>
    <tr style={style.invoiceItemTableRow}>
      <th style={style.cellHeader}>Name/Description</th>
      <th style={style.cellHeader}>Quantity</th>
      <th style={style.cellHeader}>Price per unit (Ex. VAT)</th>
      <th style={style.cellHeader}>Price (Ex. VAT)</th>
      <th style={style.cellHeader}>VAT</th>
      <th style={style.cellHeader}>Price (Inc. VAT)</th>
    </tr>
  </thead>
);


const ItemsTotal = ({ subTotal, VAT, total }) => {
  const totalCost = <span className={style.totalCost}>{`€${total}`}</span>;
  return (
    <tfoot className={style.invoicesFooter}>
      { getRow(1, ['', '', '', '', 'Subtotal', `€${subTotal}`]) }
      { getRow(2, ['', '', '', '', 'VAT', `€${VAT}`]) }
      { getRow(3, ['', '', '', '', <span className={style.totalString}>Total</span>, totalCost]) }
    </tfoot>
  );
};

const Items = ({ items }) => {
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

const ItemsPurchased = ({ items }) => {
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
  return (
    <table style={style.invoiceItemsTable}>
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

class EmailInvoice extends Component {
	render() {
  const {
    firstNameId,
    surnameId,
    saleDoc,
    items,
    customer,
    reference,
    total,
    paid,
    leftToPay
  } = this.props;
		return (
			    <div style={style.invoiceBox}>
			        <table cellpadding="0" cellspacing="0" style={style.fullWidthTable}>
			            <tr className="top">
			                <td colSpan="2" style={style.invoiceBoxTableTd}>
			                    <table style={style.fullWidthTable}>
			                        <tr>
			                            <Logo />
			                            <InvoiceMetaDetails 
											invoiceId={saleDoc.NUMBER}
											invoiceIssueDate={saleDoc.POSTDATE}
											remark={saleDoc.REMARKS}
											reference={saleDoc.REFERENCE}
			                            />
			                        </tr>
			                    </table>
			                </td>
			            </tr>
			            <tr colSpan="1">
						    <BusinessAddress
						      inline={false}
						      displayLogo={true}
						    >
						       <strong>Licence Number</strong> AFTL DK058C MFTL 1005057
							</BusinessAddress>
			            </tr>
			            <tr colSpan="1">
            	      <CustomerAddress
    					        name={customer.NAME}
    					        address1={customer.ADDRLINE01}
    					        address2={customer.ADDRLINE02}
    					        address3={customer.ADDRLINE03}
    					        address4={customer.ADDRLINE04}
    					        address5={customer.ADDRLINE05}
    					        address6={customer.ADDRLINE06}
    					      />
			            </tr>
			            <tr>
    							 <ItemsPurchased
                      items={items}
                      paid={paid}
                      outstanding={leftToPay}
    					      />
			            </tr>
			        </table>
			    </div>
      	);
	}
}

export default EmailInvoice;