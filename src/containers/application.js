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
		type: merge({}, stateProps.type, dispatchProps.type, ownProps.type),
		scope: merge({}, stateProps.scope, dispatchProps.scope, ownProps.scope),
		subject: merge({}, stateProps.subject, dispatchProps.subject, ownProps.subject),
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
		focused: state.focus,
		...createEditorMapProps('type')(state),
		...createEditorMapProps('scope')(state),
		...createEditorMapProps('subject')(state),
		...createEditorMapProps('body')(state),
		...createEditorMapProps('footer')(state)
	};
}

function mapDispatch(dispatch) {
	return {
		...createEditorMapDispatch('type')(dispatch),
		...createEditorMapDispatch('scope')(dispatch),
		...createEditorMapDispatch('subject')(dispatch),
		...createEditorMapDispatch('body')(dispatch),
		...createEditorMapDispatch('footer')(dispatch)
	};
}

const connectedApplication = connect(mapProps, mapDispatch)(Application);
export default connectedApplication;

/*
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
onNavigateLineEnd() {
	dispatch({
		type: 'FORM_NAVIGATE_LINE_END'
	});
},
onNavigateLineStart() {
	dispatch({
		type: 'FORM_NAVIGATE_LINE_START'
	});
},
onInsertion(payload) {
	dispatch({
		type: 'FORM_EDIT_INSERT',
		payload
	});
},
onDeletion(payload) {
	dispatch({
		type: 'FORM_EDIT_DELETE',
		payload
	});
},
*/
