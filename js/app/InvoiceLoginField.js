import React, { Component } from 'react'
import style from './login-page.css'
import 'font-awesome/css/font-awesome.css'

class InvoiceLoginField extends Component {
  render () {
    const { value, onUpdateInput, label, errorMessage, isValid } = this.props
    return (
      <div className={style.loginField}>
        <label className={style.fieldLabel}>
          { label }
          <i className={`fa fa-question-circle ${style.fieldLabelHelpIcon}`} aria-hidden='true' />
        </label>
        <input
          className={style.fieldInput}
          value={value}
          onChange={onUpdateInput}
          onBlur={onUpdateInput}
				/>
        { isValid ? null : errorMessage }
      </div>
    )
  }
}

export default InvoiceLoginField
