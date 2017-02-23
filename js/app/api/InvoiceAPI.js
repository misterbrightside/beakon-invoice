import { escape } from 'lodash';

export default class InvoiceAPI {

  static checkWhetherInvoiceExists(invoiceId, accountCode) {
    return fetch(`/wp-json/beakon-invoices/v1/invoice/${invoiceId}?accountCode=${accountCode}`, {
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
    debugger;
    const id = payload.ORDERID;
    return fetch(`/wp-json/beakon-invoices/v1/invoice/${id}/payment`, {
      method: 'POST',
      body: this.getUpdateInfoForSavingInvoice(payload),
    })
      .then(response => response.json());
  }
}
