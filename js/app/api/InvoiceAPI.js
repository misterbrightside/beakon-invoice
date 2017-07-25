import { escape } from 'lodash';

export default class InvoiceAPI {

  static checkWhetherInvoiceExists(invoiceId, accountCode) {
    console.log(IP_ADDRESS, 'here');
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

  static makeFormData(payload) {
    const form = new FormData();
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value) {
        form.append(key, escape(value.trim()));
      }
    });
    return form;
  }

  static getURLForWorldNetPaymentForNewOrder(payload) {
    return fetch(`${IP_ADDRESS}/wp-json/beakon-invoices/v1/order`, {
      method: 'POST',
      body: this.makeFormData(payload),
    });
  }

  static updatePaymentStatusOfInvoice(payload) {
    const id = payload.ORDERID;
    return fetch(`${IP_ADDRESS}/wp-json/beakon-invoices/v1/invoice/${id}/payment`, {
      method: 'POST',
      body: this.makeFormData(payload),
    })
      .then(response => response.json());
  }
}
