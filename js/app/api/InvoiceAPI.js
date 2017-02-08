export default class InvoiceAPI {

  static getForm (invoiceId, surname) {
    const form = new FormData()
    form.append('invoiceId', escape(invoiceId))
    form.append('surname', escape(surname))
    return form
  }

  static checkWhetherInvoiceExists (invoiceId, surname) {
    return fetch('/wp-json/beakon-invoices/v1/invoice-exists', {
      method: 'POST',
      body: this.getForm(invoiceId, surname)
    }).then(response => response.json())
  }
}
