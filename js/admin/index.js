const $ = jQuery;

class InvoiceHelper {
  static init() {
    $('.datepicker').datepicker({ dateFormat: 'dd-mm-yy' });
  }
}

$(document).ready(InvoiceHelper.init);