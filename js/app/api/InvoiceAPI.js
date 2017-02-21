import { escape } from 'lodash';

export default class InvoiceAPI {

  static getInvoiceExistsForm(invoiceId, surname = '') {
    const form = new FormData();
    form.append('surname', escape(surname.trim()));
    return form;
  }

  static getPaymentFormString(paymentData) {
    const encode = encodeURIComponent;
    const query = Object.keys(paymentData)
      .map(k => `${encode(k)}=${encode(paymentData[k])}`)
      .join('&');
    return `${paymentData.requestUrl}?${query}`;
  }

  static redirectToPaymentUrl(paymentData) {
    return InvoiceAPI.getPaymentFormString(paymentData);
  }

  static checkWhetherInvoiceExists(invoiceId, surname) {
    return fetch(`/wp-json/beakon-invoices/v1/invoice/${invoiceId}`, {
      method: 'GET',
    }).then(response => response.json());
  }

  static getURLForWorldNetPayment(invoiceId) {
    return fetch('/wp-json/beakon-invoices/v1/pay-invoice', {
      method: 'POST',
      body: this.getInvoiceExistsForm(invoiceId),
    })
      .then(response => response.json())
      .then(json => JSON.parse(json));
  }

  static getUpdateInfoForSavingInvoice(payload) {
    const form = new FormData();
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      form.append(key, escape(value.trim()));
    });
    return form;
  }

  static updatePaymentStatusOfInvoice(payload) {
    return fetch('/wp-json/beakon-invoices/v1/update-payment-status-of-invoice', {
      method: 'POST',
      body: this.getUpdateInfoForSavingInvoice(payload),
    })
      .then(response => response.json())
      .then(json => JSON.parse(json));
  }
}
