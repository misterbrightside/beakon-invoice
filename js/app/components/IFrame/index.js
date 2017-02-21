import React, { Component, PropTypes } from 'react';
import style from './iframe-css.css';

export default class IFrame extends Component {

  static propTypes = {
    src: PropTypes.string,
    maybeOnLoad: PropTypes.func.isRequired,
  };

  maybeUseOnLoad = (event) => {
    const { maybeOnLoad } = this.props;
    if (this.canAccessIFrame(this.iframe)) {
      maybeOnLoad(event);
    }
  }

  canAccessIFrame = (iframe) => {
    let html = null;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      html = doc.body.innerHTML;
    } catch (err) { return false; }
    return html !== null;
  }

  render() {
    const { src } = this.props;
    return (
      <iframe
        className={style.paymentIframe}
        ref={(iframeWindow) => { this.iframe = iframeWindow; }}
        src={src}
        onLoad={this.maybeUseOnLoad}
      />
    );
  }
}
