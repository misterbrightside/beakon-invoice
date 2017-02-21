import React, { Component } from 'react';
import { render, findDOMNode } from 'react-dom';
import PayInvoicesApplication from './components/Application/';

class App extends Component {

  constructor() {
    super();
    this.state = {
      height: '0px'
    };
  }

  componentDidMount() {
    this.getHeight();
  }

  getHeight = () => {
    const obj = findDOMNode(this);
    console.log('componentDidMount')
    this.setState({ height: this.frame.iframeObject.contentDocument.body.scrollHeight + 'px' });
  }

	render() {
		return (
      <PayInvoicesApplication />
    );
	}
}

render(<App />, document.getElementById('invoices-app'));
