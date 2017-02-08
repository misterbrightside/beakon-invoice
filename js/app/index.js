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

const CheckInvoiceButton = () => (
  <div className={style.findInvoiceButtonContainer}>
    <button>Find my invoice ➔</button>
  </div>
)

class HelloWorld extends Component {
  render () {
    return (
      <div className={style.invoicesLogin}>
        <form className={style.invoicesContainer}>
          <h1 className={style.invoicesLoginHeader}>Pay a Bill</h1>
          <InvoiceLoginField label={'Invoice Number'} />
          <InvoiceLoginField label={'Surname'} />
          <CheckInvoiceButton />
        </form>
      </div>
    )
  }
}

ReactDOM.render(<HelloWorld />, document.getElementById('invoices-app'))
