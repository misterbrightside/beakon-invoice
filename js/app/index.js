import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import style from './login-page.css'
import { escape } from 'lodash'
import 'font-awesome/css/font-awesome.css'

const InvoiceLoginField = ({ label, value, onUpdateInput, id }) => (
  <div className={style.loginField}>
    <label className={style.fieldLabel}>
      { label }
      <i className={`fa fa-question-circle ${style.fieldLabelHelpIcon}`} aria-hidden='true' />
    </label>
    <input
      className={style.fieldInput}
      value={value}
      onChange={onUpdateInput}
		/>
  </div>
)

const CheckInvoiceButton = ({ onSubmitForm }) => (
  <div className={style.findInvoiceButtonContainer}>
    <button onClick={onSubmitForm}>
			Find my invoice ➔
		</button>
  </div>
)

class InvoiceLogin extends Component {
  constructor () {
    super()
    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
    this.API_LOCATION = '/wp-json/beakon-invoices/v1/invoice-exists'
    this.state = {
      invoiceId: '',
      surname: ''
    }
  }

  updateFieldValue = (id) => (event) => {
    event.preventDefault()
    const { value } = event.target
		this.setState({
			[id]: value
		})
  }

  getForm (invoiceId, surname) {
    const form = new FormData()
    form.append('invoiceId', escape(invoiceId))
    form.append('surname', escape(surname))
    return form
  }

  onSubmitForm (event) {
		const { invoiceId, surname } = this.state
    event.preventDefault()
    fetch(this.API_LOCATION, {
      method: 'POST',
      body: this.getForm(invoiceId, surname)
    }).then(response => response.json())
			.then(json => console.log(json))
			.catch(error => console.error(error))
  }

  render () {
    const { invoiceId, surname } = this.state
    return (
      <div className={style.invoicesLogin}>
        <form className={style.invoicesContainer}>
          <h1 className={style.invoicesLoginHeader}>Pay a Bill</h1>
          <InvoiceLoginField
            label={'Invoice Number'}
            value={invoiceId}
            onUpdateInput={this.updateFieldValue('invoiceId')}
					/>
          <InvoiceLoginField
            label={'Surname'}
            value={surname}
            onUpdateInput={this.updateFieldValue('surname')}
					/>
          <CheckInvoiceButton
            onSubmitForm={this.onSubmitForm}
					/>
        </form>
      </div>
    )
  }
}

ReactDOM.render(<InvoiceLogin />, document.getElementById('invoices-app'))
