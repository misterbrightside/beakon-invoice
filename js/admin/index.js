import React, { Component } from 'react';
import { render } from 'react-dom';

const $ = jQuery;

class InvoiceItems extends Component {
  constructor() {
    super();
    this.getDatePicker();
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    fetch('/wp-json/beakon-invoices/v1/invoices/85', {
      method: 'GET',
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        return this.setState({ items: this.getItems(data.items) });
      });
  }

  getDatePicker = () => {
    $('.datepicker').datepicker({ dateFormat: 'dd-mm-yy' });
  }

  getItems = (items) => {
    if (items.length === 0) return [{ name: '', price: '', quantity: '' }];
    return items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
  }

  removeItem = (item, index) => (event) => {
    event.preventDefault();
    const { items } = this.state;
    this.setState({
      items: [
        ...items.slice(0, index),
        ...items.slice(index + 1, items.length),
      ],
    });
  }

  addItem = (event) => {
    event.preventDefault();
    const { items } = this.state;
    this.setState({
      items: [...items, { name: '', price: '', quantity: '' }],
    });
  }

  updateItemField = (index, key) => (event) => {
    const { items } = this.state;
    this.setState({
      items: [
        ...items.slice(0, index),
        Object.assign(items[index], { [key]: event.target.value }),
        ...items.slice(index + 1, items.length),
      ],
    });
  }

  renderInputTag(labelHeading, index, key, value, size) {
    const labelFor = `item_data[${index}][${key}]`;
    return (
      <span key={labelFor}>
        <label
          htmlFor={labelFor}
        >
          {labelHeading}:
        </label>
        <input
          type={'text'}
          name={labelFor}
          size={size}
          onChange={this.updateItemField(index, key)}
          value={value}
        />
      </span>
    );
  }

  renderItem = (item, index) => {
    const key = `invoice-item-${index}`;
    return (
      <li key={key}>
        { this.renderInputTag('Name', index, 'name', item.name, 50) }
        { this.renderInputTag('Unit Price', index, 'price', item.price, 10) }
        { this.renderInputTag('Quantity', index, 'quantity', item.quantity, 20) }
        <button onClick={this.removeItem(item, index)}>Remove</button>
      </li>
    );
  }

  render() {
    const { items } = this.state;
    return (
      <ul>
        <button onClick={this.addItem}>Add item</button>
        { items.map(this.renderItem) }
        <button onClick={this.addItem}>Add item</button>
      </ul>
    );
  }
}

render(<InvoiceItems />, document.getElementById('list-of-items'));
