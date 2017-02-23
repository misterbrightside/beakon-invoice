import 'font-awesome/css/font-awesome.css';
import React, { PropTypes } from 'react';
import Tooltip from 'rc-tooltip';
import style from './login-page.css';
import 'rc-tooltip/assets/bootstrap.css';

const InvoiceLoginField = ({ value, onUpdateInput, label, errorMessage, isValid, id, tooltipText }) => (
  <div className={style.loginField}>
    <label
      className={style.fieldLabel}
      htmlFor={id}
    >
      { label }
      <Tooltip overlay={<span className={style.tooltipText}>{tooltipText}</span>}>
        <i
          className={`fa fa-question-circle ${style.fieldLabelHelpIcon}`}
          aria-hidden={'true'}
        />
      </Tooltip>
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
