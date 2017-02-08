import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import style from './login-page.css'
import 'font-awesome/css/font-awesome.css'

const InvoiceLoginField = ({ label }) => (
  <div className={style.loginField}>
    <label className={style.fieldLabel}>
      { label }
      <i className={`fa fa-question-circle ${style.fieldLabelHelpIcon}`} aria-hidden='true' />
    </label>
    <input className={style.fieldInput} />
  </div>
)

const CheckInvoiceButton = ({ onSubmitForm }) => (
  <div className={style.findInvoiceButtonContainer}>
    <button onClick={onSubmitForm}>
			Find my invoice ➔
		</button>
  </div>
)

class HelloWorld extends Component {

  constructor () {
    super()
    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.API_LOCATION = '/wp-content/plugins/beakon-invoice/public/api/test-api.php'
  }

  getForm () {
    const form = new FormData()
    form.append('invoiceId', '10203020')
    form.append('surname', 'brennan')
    return form
  }

  onSubmitForm (event) {
    event.preventDefault()
    fetch(this.API_LOCATION, {
      method: 'post',
      body: this.getForm()
    }).then(response => response.json())
			.then(json => console.log(json))
			.catch(error => console.error(error))
  }

  render () {
    return (
      <div className={style.invoicesLogin}>
        <form className={style.invoicesContainer}>
          <h1 className={style.invoicesLoginHeader}>Pay a Bill</h1>
          <InvoiceLoginField label={'Invoice Number'} />
          <InvoiceLoginField label={'Surname'} />
          <CheckInvoiceButton
            onSubmitForm={this.onSubmitForm}
					/>
        </form>
      </div>
    )
  }
}

ReactDOM.render(<HelloWorld />, document.getElementById('invoices-app'))
