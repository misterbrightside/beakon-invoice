import React, { Component, PropTypes } from 'react';

export default class IFrame extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    maybeOnLoad: PropTypes.func.isRequired,
    className: PropTypes.string,
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
    const { src, className } = this.props;
    return (
      <iframe
        className={className}
        ref={(iframeWindow) => { this.iframe = iframeWindow; }}
        src={src}
        onLoad={this.maybeUseOnLoad}
      />
    );
  }
}
