import React, {Component} from 'react';
import {connect as reduxConnect} from 'react-redux';
import {merge, partialRight} from 'lodash';
import {createEditorMapProps, createEditorMapDispatch} from 'react-blessed-editor';

import Form from '../components/form';

function mergeProps(stateProps, dispatchProps, ownProps) {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		body: merge({}, stateProps.body, dispatchProps.body, ownProps.body),
		footer: merge({}, stateProps.footer, dispatchProps.footer, ownProps.footer)
	};
}

const connect = partialRight(reduxConnect, mergeProps);

class Application extends Component {
	render() {
		return <Form {...this.props}/>;
	}
}

function mapProps(state) {
	return {
		environment: state.environment,
		form: state.form,
		focused: state.focus,
		...createEditorMapProps('body')(state),
		...createEditorMapProps('footer')(state)
	};
}

function mapDispatch(dispatch) {
	return {
		onBlur: dispatch,
		onFocus: dispatch,
		onKeypress: dispatch,
		onNavigateForward() {
			dispatch({
				type: 'FORM_NAVIGATE_FORWARD',
				payload: {
					length: 1
				}
			});
		},
		onNavigateBackward() {
			dispatch({
				type: 'FORM_NAVIGATE_BACKWARD',
				payload: {
					length: 1
				}
			});
		},
		onNavigateUp() {
			dispatch({
				type: 'FORM_NAVIGATE_UP',
				payload: {
					length: 1
				}
			});
		},
		onNavigateDown() {
			dispatch({
				type: 'FORM_NAVIGATE_DOWN',
				payload: {
					length: 1
				}
			});
		},
		...createEditorMapDispatch('body')(dispatch),
		...createEditorMapDispatch('footer')(dispatch)
	};
}

const connectedApplication = connect(mapProps, mapDispatch)(Application);
export default connectedApplication;
