import { escape } from 'lodash';

export default class InvoiceAPI {

  static getInvoiceExistsForm(invoiceId, surname = '') {
    const form = new FormData();
    form.append('invoiceId', escape(invoiceId.trim()));
    form.append('surname', escape(surname.trim()));
    return form;
  }

  static getPaymentFormString(paymentData) {
    var esc = encodeURIComponent;
    var query = Object.keys(paymentData)
      .map(k => `${esc(k)}=${esc(paymentData[k])}`)
      .join('&');
    return `${paymentData.requestUrl}?${query}`;
  }

  static redirectToPaymentUrl(paymentData) {
    return InvoiceAPI.getPaymentFormString(paymentData);
  }

  static checkWhetherInvoiceExists(invoiceId, surname) {
    return fetch('/wp-json/beakon-invoices/v1/invoice-exists', {
      method: 'POST',
      body: this.getInvoiceExistsForm(invoiceId, surname),
    }).then(response => response.json())
      .then(json => JSON.parse(json));
  }

  static getURLForWorldNetPayment(invoiceId) {
    return fetch('/wp-json/beakon-invoices/v1/pay-invoice', {
      method: 'POST',
      body: this.getInvoiceExistsForm(invoiceId),
    })
      .then(response => response.json())
      .then(json => JSON.parse(json));
  }
}
