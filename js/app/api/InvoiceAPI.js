import { escape } from 'lodash';

export default class InvoiceAPI {

  static checkWhetherInvoiceExists(invoiceId, accountCode) {
    console.log();
    return fetch(`${IP_ADDRESS}/wp-json/beakon-invoices/v1/invoice/${invoiceId.toUpperCase()}?accountCode=${accountCode.toUpperCase()}`, {
      method: 'GET',
    }).then(response => response.json());
  }

  static getURLForWorldNetPayment(invoiceId, emailAddress) {
    return fetch(`${IP_ADDRESS}/wp-json/beakon-invoices/v1/invoice/${invoiceId}/worldnet-payment-url?EMAIL=${emailAddress}`, {
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
    const id = payload.ORDERID;
    return fetch(`${IP_ADDRESS}/wp-json/beakon-invoices/v1/invoice/${id}/payment`, {
      method: 'POST',
      body: this.getUpdateInfoForSavingInvoice(payload),
    })
      .then(response => response.json());
  }
}
