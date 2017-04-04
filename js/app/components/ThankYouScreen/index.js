import React, { Component, PropTypes } from 'react';
import moment from 'moment';

const style = {
  thankYouMessageBox: {
    width: '70%',
    margin: 'auto',
    background: '#f1f1f2',
    padding: '25px',
    textAlign: 'center',
    marginTop: '1em',
    lineHeight: 'normal',
    marginBottom: '5em',
  },

  thankYouMessageBoxNoBackground: {
    width: '70%',
    margin: 'auto',
    padding: '25px',
    textAlign: 'center',
  },

  thankYouHeader: {
    color: '#e52025',
    fontSize: '3.6rem',
    fontWeight: 'bolder',
    marginTop: '1em',
    marginBottom: '.5em'
  },

  orderNumber: {
    fontSize: '1.5em',
    paddingBottom: '10px'
  },

  orderNumberSpan: {
    fontWeight: '900'
  },

  orderBlurb: {
    textAlign: 'center',
    fontSize: '1.5em'
  },

  orderDetails: {
    textAlign: 'center',
    fontSize: '1.5em',
    margin: '10px 0'
  },

  orderDetailsHeader: {
    fontWeight: '900',
    fontSize: '1.2em',
    margin: '15px 0'
  },

  seperate: {
    margin: '15px 0'
  },

  deliveryDetails: {
    textAlign: 'center',
    fontSize: '1.5em',
    margin: '10px 0'
  },

  thankYouFooter: {
    marginTop: '40px',
    width: '50%',
    margin: 'auto',
    textAlign: 'center',
    color: '#808080'
  },

  address: {
    margin: '10px 0',
    fontStyle: 'normal'
  },

  paymentBlurb: {
    color: '#e41f24',
    fontWeight: '900',
  },

  image: {
    width: '50%',
    margin: '10px 0'
  }
}

const isUndefined = (prop) => (
  prop === undefined || prop === 'undefined' || prop === null || prop === 'null'
);

const ThanksForOrdering = ({ budget, message, ftype, quant, date, orderId, fname, company, add1, add2, town, county, eircode, phone, PayNow }) => (
  <div>
    <div style={style.thankYouMessageBoxNoBackground}><img style={style.image} src={'http://dundalkoil.beakon.ie/wp-content/uploads/2016/11/Logo.png'} /></div>
    <div style={style.thankYouMessageBox}>
      <div style={style.thankYouHeader}>Thank you for your order.</div>
      <div style={style.orderNumber}>Order No.: <span style={style.orderNumberSpan}>#{PayNow === 'true' || PayNow === true ? `PN-${orderId}` : `PL-${orderId}` }</span></div>
      <div style={style.orderBlurb}>
        <p>Your online order was received on <span style={style.orderNumberSpan}>{moment(unescape(date), 'DD/MM/YYYY').format('DD/MM/YYYY')}.</span></p>
        <p>A member of staff will be in contact with you to confirm your order and to arrange delivery.</p>
        <p>If you have any questions about your order, or would like to cancel or amend it, please call us on +353 (0) 42 933 4081.</p>
      </div>
      <div style={style.orderDetails}>
        <div style={style.orderDetailsHeader}>Your Order Details:</div>
        <div style={style.seperate}>{ftype} x {quant}L</div>
        <div style={style.seperate}>€{parseFloat(Math.round(budget * 100) / 100).toFixed(2)} (inc. VAT)</div>
        <div style={style.seperate}><span style={style.paymentBlurb}>{ message }</span></div>
      </div>
      <div style={style.deliveryDetails}>
        <div style={style.orderDetailsHeader}>Delivery Details:</div>
        { !isUndefined(fname) ? <div>{fname}</div> : null }
        { !isUndefined(company) ? <div>{company}</div> : null }
        { !isUndefined(add1) ? <div>{add1}</div> : null }
        { !isUndefined(add2) ? <div>{add2}</div> : null }
        { !isUndefined(town) ? <div>{town}</div> : null }
        { !isUndefined(county) ? <div>{county}</div> : null }
        { !isUndefined(eircode) ? <div>{eircode}</div> : null }
        { !isUndefined(phone) ? <div>{phone}</div> : null }
      </div>
      <div style={style.thankYouFooter}>
        <img style={style.image} src='http://dundalkoil.beakon.ie/wp-content/uploads/2017/02/texaco-logo-1.png' />
        <address style={style.address}>Dundalk Oil Products, Brewery Business Park, Ardee Rd,Co. Louth, A91 ABCD.</address>
        <div>Tel: 042 933 4081 Web: dundalkoil.ie</div><div>Email: info@dundalkoil.ie</div>
      </div>
    </div>
  </div>
);

export default ThanksForOrdering;