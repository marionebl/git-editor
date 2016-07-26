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

function createFormInputMapDispatch(id) {
	return dispatch => {
		const editorDispatch = createEditorMapDispatch(id)(dispatch);
		const inputDispatch = {
			[id]: {
				onInsertion(data, character) {
					if (data === '\t') {
						dispatch({
							type: 'FORM_NAVIGATE_FORWARD',
							payload: {
								length: 1
							}
						});
						return;
					}
					editorDispatch[id].onInsertion(data, character);
				},
				onGoUpInfinity() {
					// to [0, 0]
					dispatch({
						type: 'FORM_NAVIGATE_UP',
						payload: {
							length: Infinity
						}
					});
				},
				onGoRightInfinity() {
					// to [Infinity, current]
					dispatch({
						type: 'FORM_NAVIGATE_LINE_END'
					});
				},
				onGoLeftInfinity() {
					// to [0, current]
					dispatch({
						type: 'FORM_NAVIGATE_LINE_START'
					});
				},
				onGoDownInfinity() {
					// to [Infinity, Infinity]
					dispatch({
						type: 'FORM_NAVIGATE_DOWN',
						payload: {
							length: Infinity
						}
					});
				},
				onGoRightWord(...args) {
					// next if last char under cursor
					const [props] = args;
					const {content, cursor} = props;

					if (cursor.x >= content.length - 1) {
						dispatch({
							type: 'FORM_NAVIGATE_FORWARD',
							payload: {
								length: 1
							}
						});
						return;
					}

					editorDispatch[id].onGoRightWord(...args);
				},
				onGoLeftWord(...args) {
					// next if first char under cursor
					const [props] = args;
					const {cursor} = props;

					if (cursor.x === 0) {
						dispatch({
							type: 'FORM_NAVIGATE_BACKWARD',
							payload: {
								length: 1
							}
						});
						return;
					}

					editorDispatch[id].onGoLeftWord(...args);
				},
				onGoUp() {
					// up a line
					dispatch({
						type: 'FORM_NAVIGATE_UP',
						payload: {
							length: 1
						}
					});
				},
				onGoRight(...args) {
					// next if last char under cursor
					const [props] = args;
					const {content, cursor} = props;

					if (cursor.x >= content.length - 1) {
						dispatch({
							type: 'FORM_NAVIGATE_FORWARD',
							payload: {
								length: 1
							}
						});
						return;
					}

					editorDispatch[id].onGoRight(...args);
				},
				onGoDown() {
					// down a line
					dispatch({
						type: 'FORM_NAVIGATE_DOWN',
						payload: {
							length: 1
						}
					});
				},
				onGoLeft(...args) {
					// previous if first char under cursor
					const [props] = args;
					const {cursor} = props;

					if (cursor.x === 0) {
						dispatch({
							type: 'FORM_NAVIGATE_BACKWARD',
							payload: {
								length: 1
							}
						});
						return;
					}

					editorDispatch[id].onGoLeft(...args);
				}
			}
		};
		return merge({}, editorDispatch, inputDispatch);
	};
}

function createEditorFormMapDispatch(id) {
	return dispatch => {
		const editorDispatch = createEditorMapDispatch(id)(dispatch);

		const editorFormDispatch = {
			[id]: {
				onGoUpInfinity() {
					// to [0, 0]
					dispatch({
						type: 'FORM_NAVIGATE_UP',
						payload: {
							length: Infinity
						}
					});
				},
				onGoDownInfinity() {
					// to [Infinity, Infinity]
					dispatch({
						type: 'FORM_NAVIGATE_DOWN',
						payload: {
							length: Infinity
						}
					});
				},
				onGoUp(...args) {
					const [props] = args;
					const {cursor} = props;
					if (cursor.y === 0) {
						dispatch({
							type: 'FORM_NAVIGATE_UP',
							payload: {
								length: 1
							}
						});
						return;
					}
					editorDispatch[id].onGoUp(...args);
				},
				onGoRight(...args) {
					const [props] = args;
					const {cursor, content} = props;
					const lines = content.split('\n');
					const lastLine = lines[lines.length - 1];

					if (cursor.y === lines.length - 1 && cursor.x === lastLine.length - 1) {
						dispatch({
							type: 'FORM_NAVIGATE_FORWARD',
							payload: {
								length: 1
							}
						});
						return;
					}

					editorDispatch[id].onGoRight(...args);
				},
				onGoDown(...args) {
					const [props] = args;
					const {cursor, content} = props;
					const lines = content.split('\n');
					if (cursor.y === lines.length - 1) {
						dispatch({
							type: 'FORM_NAVIGATE_DOWN',
							payload: {
								length: 1
							}
						});
						return;
					}
					editorDispatch[id].onGoDown(...args);
				},
				onGoLeft(...args) {
					const [props] = args;
					const {cursor} = props;
					console.log(cursor);
					if (cursor.y === 0 && cursor.x === 0) {
						dispatch({
							type: 'FORM_NAVIGATE_BACKWARD',
							payload: {
								length: 1
							}
						});
						return;
					}
					editorDispatch[id].onGoLeft(...args);
				}
			}
		};

		console.log(editorFormDispatch);
		return merge({}, editorDispatch, editorFormDispatch);
	};
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
		...createFormInputMapDispatch('type')(dispatch),
		...createFormInputMapDispatch('scope')(dispatch),
		...createFormInputMapDispatch('subject')(dispatch),
		...createEditorFormMapDispatch('body')(dispatch),
		...createEditorFormMapDispatch('footer')(dispatch)
	};
}

const connectedApplication = connect(mapProps, mapDispatch)(Application);
export default connectedApplication;
