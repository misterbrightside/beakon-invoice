const $ = jQuery;

class InvoiceHelper {
  constructor() {
    this.initDatePicker();
    this.initInvoiceItemsMetaBox();
  }

  initDatePicker = () => {
    $('.datepicker').datepicker({ dateFormat: 'dd-mm-yy' });
  }

  initInvoiceItemsMetaBox() {
    $('.add').click(this.onClickAddItem);
    $(document).on('click', '.removeInvoiceItem', this.onClickRemoveItem);
  }

  onClickAddItem = () => {
    $('#list-of-items').append(this.newItemTemplate());
  }

  onClickRemoveItem() {
    $(this).parent().remove();
  }

  getInputTag = (labelHeading, index, key, value, size) => {
    return `
      <label>${labelHeading}:</label>
      <input type='text' name='item_data[${index}][${key}]' size='${size}' value='${value}' />
    `;
  }

  newItemTemplate() {
    return `
      <li>
        ${this.getInputTag('Name', 0, 'nameOfItem', '', 50)}
        ${this.getInputTag('Unit Price', 0, 'unitPrice', '', 10)}
        ${this.getInputTag('Quantity', 0, 'quantityValue', '', 20)}
        <span class='removeInvoiceItem'>Remove</span>
      </li>
    `;
  }
}

$(document).ready(new InvoiceHelper());
