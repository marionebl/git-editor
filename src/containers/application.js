import React, {Component} from 'react';
import {connect} from 'react-redux';

import Form from '../components/form';

class Application extends Component {
	render() {
		return <Form {...this.props}/>;
	}
}

function mapProps(state) {
	return {
		environment: state.environment,
		form: state.form
	};
}

function mapDispatch(dispatch) {
	return {
		onBlur: dispatch,
		onFocus: dispatch,
		onKeypress: dispatch
	};
}

const connectedApplication = connect(mapProps, mapDispatch)(Application);

export default connectedApplication;
