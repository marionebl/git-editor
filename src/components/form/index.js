import React, {Component, PropTypes as t} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';
import {noop} from 'lodash';

import Input from '../input';
import Area from '../area';

const placeholders = {
	type: 'type',
	scope: 'scope',
	subject: 'subject'
};

function getMaxLength() {
	return Array.prototype.slice.call(arguments)
		.filter(Boolean)
		.map(arg => arg.length)
		.sort((a, b) => b - a)[0];
}

function getFieldOffset(name, form, focused) {
	const value = form[name] || '';
	const isFocused = focused === name;

	if (isFocused && value.length > 0) {
		const maxLength = getMaxLength(form.type, placeholders.type);
		return value.length >= maxLength ?
			value.length + 1 :
			maxLength;
	}

	return value ?
		value.length :
		placeholders[name].length;
}

@pure
@autobind
class Form extends Component {
	static placeholders = placeholders;

	static propTypes = {
		onBlur: t.func,
		onFocus: t.func,
		onKeypress: t.func,
		onNavigateForward: t.func,
		onNavigateBackward: t.func,
		onNavigateForwardInfinity: t.func,
		onNavigateBackwardInfinity: t.func,
		onNavigateUp: t.func,
		onNavigateDown: t.func,
		form: t.any,
		focused: t.string,
		body: t.any,
		footer: t.any
	};

	static defaultProps = {
		onNavigateForward: noop,
		onNavigateForwardInfinity: noop,
		onNavigateBackward: noop,
		onNavigateBackwardInfinity: noop,
		onNavigateUp: noop,
		onNavigateDown: noop
	};

	nodes = {};
	attached = false;

	componentDidMount() {
		const {form} = this.nodes;

		if (form && !this.attached) {
			const {screen} = form;
			screen.on('keypress', this.handleScreenKeyPress);
			this.attached = true;
		}
	}

	componentWillUnmount() {
		const {form} = this.nodes;
		if (form) {
			const {screen} = form;
			screen.off('keypress', this.handleScreenKeyPress);
		}
	}

	handleNavigateForward() {
		this.props.onNavigateForward();
	}

	handleNavigateBackward() {
		this.props.onNavigateBackward();
	}

	handleNavigateUp() {
		this.props.onNavigateUp();
	}

	handleNavigateDown() {
		this.props.onNavigateDown();
	}

	handleScreenKeyPress(data, character) {
		const {props} = this;

		if (['body', 'footer'].includes(props.focused)) {
			const area = props[props.focused];
			const {cursor, children = ''} = area;
			const lines = children.split('\n');

			switch (character.full) {
				case 'S-tab':
					break;
				case 'tab': {
					if (children.length === 0) {
						break;
					} else {
						return;
					}
				}
				case 'left': {
					if (cursor.y === 0 && cursor.x === 0) {
						break;
					} else {
						return;
					}
				}
				case 'right': {
					const count = lines.length - 1;
					const last = lines[count];
					if (cursor.y === count && cursor.x === last.length) {
						break;
					} else {
						return;
					}
				}
				case 'up': {
					if (cursor.y === 0) {
						break;
					} else {
						return;
					}
				}
				case 'down': {
					if (cursor.y === lines.length - 1) {
						break;
					} else {
						return;
					}
				}
			}
		}

		switch (character.full) {
			case 'tab':
			case 'right':
			case 'C-right':
				this.handleNavigateForward();
				break;
			case 'S-tab':
			case 'left':
			case 'C-left':
				this.handleNavigateBackward();
				break;
			case 'up':
				this.handleNavigateUp();
				break;
			case 'down':
				this.handleNavigateDown();
				break;
			default:
				break;
		}
	}

	saveNode(name) {
		return ref => {
			this.nodes[name] = ref;
		};
	}

	render() {
		const {form, focused, body, footer} = this.props;

		const typeOffset = getFieldOffset('type', form, focused);
		const scopeOffset = typeOffset + getFieldOffset('scope', form, focused);
		const bodyHeight = Math.max(0, (body.children || '').split('\n').length);
		const bodyOffset = bodyHeight > 0 ? bodyHeight + 1 : 0;

		return (
			<form
				ref={this.saveNode('form')}
				>
				<box>
					<box>
						<Input
							name="type"
							placeholder="type"
							focus={focused === 'type'}
							ref={this.saveNode('type')}
							value={form.type}
							onKeypress={this.handleKeypress}
							/>
						<text left={typeOffset}>(</text>
						<Input
							left={typeOffset + 1}
							name="scope"
							placeholder="scope"
							focus={focused === 'scope'}
							ref={this.saveNode('scope')}
							value={form.scope}
							onKeypress={this.handleKeypress}
							/>
						<text left={scopeOffset + 1}>)</text>
						<text left={scopeOffset + 2}>:</text>
						<text left={scopeOffset + 3}> </text>
						<Input
							left={scopeOffset + 4}
							name="subject"
							placeholder="subject"
							focus={focused === 'subject'}
							ref={this.saveNode('subject')}
							value={form.subject}
							onKeypress={this.handleKeypress}
							/>
					</box>
					<box top={2} left={0}>
						<Area
							{...body}
							value={body.children}
							top={0}
							name="body"
							placeholder="Body"
							focus={focused === 'body'}
							/>
						<Area
							{...footer}
							value={footer.children}
							top={bodyOffset}
							name="footer"
							placeholder="Footer"
							focus={focused === 'footer'}
							/>
					</box>
				</box>
			</form>
		);
	}
}

export default Form;
