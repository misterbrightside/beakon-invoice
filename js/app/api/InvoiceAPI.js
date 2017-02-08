export default class InvoiceAPI {

  static getForm (invoiceId, surname) {
    const form = new FormData()
    form.append('invoiceId', escape(invoiceId.trim()))
    form.append('surname', escape(surname.trim()))
    return form
  }

  static checkWhetherInvoiceExists (invoiceId, surname) {
    return fetch('/wp-json/beakon-invoices/v1/invoice-exists', {
      method: 'POST',
      body: this.getForm(invoiceId, surname)
    }).then(response => response.json())
			.then(json => JSON.parse(json))
  }
}
