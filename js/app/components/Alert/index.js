import React, { PropTypes } from 'react';
import style from './alert-styles.css'

const Alert = ({ children, alertType }) => (
  <div
    className={style[alertType]}
  >
    { children }
  </div>
);

Alert.propTypes = {
  children: PropTypes.node,
  alertType: PropTypes.oneOf(['success', 'warning', 'info']).isRequired,
};

Alert.defaultProps = {
  children: null,
};

export default Alert;
