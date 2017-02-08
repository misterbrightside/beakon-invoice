import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import InvoiceLoginField from './InvoiceLoginField'
import style from './login-page.css'
import { escape } from 'lodash'

const CheckInvoiceButton = () => (
  <div className={style.findInvoiceButtonContainer}>
    <button type="submit">
			Find my invoice ➔
		</button>
  </div>
)

const InputFieldError = ({ label }) => (
	<div className={style.inputFieldErrorMessage}>
		{ label }
	</div>
)

class InvoiceLogin extends Component {
  constructor () {
    super()
    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.updateFieldValue = this.updateFieldValue.bind(this)
    this.API_LOCATION = '/wp-json/beakon-invoices/v1/invoice-exists'
    this.state = {
      invoiceId: this.getInitialInputState(),
      surname: this.getInitialInputState()
    }
  }

	getInitialInputState() {
		return ({
			value: '', valid: false, touched: false
		})
	}

  updateFieldValue = (id) => (event) => {
    event.preventDefault()
    const { value } = event.target
		return this.setState({
			[id]: {
				value,
				valid: value.trim().length > 0,
				touched: true
			}
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
      body: this.getForm(invoiceId.value, surname.value)
    }).then(response => response.json())
			.then(json => console.log(json))
			.catch(error => console.error(error))
  }

	isValid = (field) => {
		return this.state[field].valid || !this.state[field].touched
	}

  render () {
    const { invoiceId, surname } = this.state
    return (
      <div className={style.invoicesLogin}>
        <form
					className={style.invoicesContainer}
					onSubmit={this.onSubmitForm}
				>
          <h1 className={style.invoicesLoginHeader}>Pay a Bill</h1>
          <InvoiceLoginField
            label={'Invoice Number'}
            value={invoiceId.value}
            onUpdateInput={this.updateFieldValue('invoiceId')}
						errorMessage={<InputFieldError label={'You must enter a valid invoice reference.'} />}
						isValid={this.isValid('invoiceId')}
					/>
          <InvoiceLoginField
            label={'Surname'}
            value={surname.value}
            onUpdateInput={this.updateFieldValue('surname')}
						errorMessage={<InputFieldError label={'You must enter a valid surname.'} />}
						isValid={this.isValid('surname')}
					/>
          <CheckInvoiceButton />
        </form>
      </div>
    )
  }
}

ReactDOM.render(<InvoiceLogin />, document.getElementById('invoices-app'))
