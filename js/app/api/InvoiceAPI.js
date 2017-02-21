import { escape } from 'lodash';

export default class InvoiceAPI {

  static checkWhetherInvoiceExists(invoiceId, surname) {
    return fetch(`/wp-json/beakon-invoices/v1/invoice/${invoiceId}`, {
      method: 'GET',
    }).then(response => response.json());
  }

  static getURLForWorldNetPayment(invoiceId) {
    return fetch(`/wp-json/beakon-invoices/v1/invoice/${invoiceId}/worldnet-payment-url`, {
      method: 'GET',
    })
      .then(response => response.json());
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
