import React, { Component } from 'react';
import { render, findDOMNode } from 'react-dom';
import PayInvoicesApplication from './components/Application/';

const App = () => (
		<PayInvoicesApplication />
);

render(<App />, document.getElementById('invoices-app'));
