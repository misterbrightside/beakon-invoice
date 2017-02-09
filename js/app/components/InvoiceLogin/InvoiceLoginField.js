import 'font-awesome/css/font-awesome.css';
import React, { PropTypes } from 'react';
import style from './login-page.css';

const InvoiceLoginField = ({ value, onUpdateInput, label, errorMessage, isValid, id }) => (
  <div className={style.loginField}>
    <label
      className={style.fieldLabel}
      htmlFor={id}
    >
      { label }
      <i
        className={`fa fa-question-circle ${style.fieldLabelHelpIcon}`}
        aria-hidden={'true'}
      />
    </label>
    <input
      className={style.fieldInput}
      value={value}
      onChange={onUpdateInput}
      onBlur={onUpdateInput}
    />
    { isValid ? null : errorMessage }
  </div>
);

InvoiceLoginField.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdateInput: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  errorMessage: PropTypes.element.isRequired,
  isValid: PropTypes.bool.isRequired,
  id: PropTypes.string,
};

InvoiceLoginField.defaultProps = {
  id: '',
};

export default InvoiceLoginField;
