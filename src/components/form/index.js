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
		onNavigateLineStart: t.func,
		onNavigateLineEnd: t.func,
		onNavigateUp: t.func,
		onNavigateDown: t.func,
		onInsertion: t.func,
		onDeletion: t.func,
		focused: t.string,
		type: t.any,
		scope: t.any,
		subject: t.any,
		body: t.any,
		footer: t.any
	};

	static defaultProps = {
		onNavigateForward: noop,
		onNavigateForwardInfinity: noop,
		onNavigateBackward: noop,
		onNavigateBackwardInfinity: noop,
		onNavigateLineStart: noop,
		onNavigateLineEnd: noop,
		onNavigateUp: noop,
		onNavigateDown: noop,
		onInsertion: noop,
		onDeletion: noop
	};

	nodes = {};
	attached = false;

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

	handleNavigateLineStart() {
		this.props.onNavigateLineStart();
	}

	handleNavigateLineEnd() {
		this.props.onNavigateLineEnd();
	}

	handleScreenKeyPress(data, character) {
		const {props} = this;

		const area = props[props.focused];
		const {cursor, children = ''} = area;
		const lines = children.split('\n');

		console.log(character);

		/* switch (character.full) {
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
			default:
				return;
		} */

	/* c	const value = props.form[props.focused] ||
			props.focused in props ?
				[props.focused].children : '';

		switch (character.full) {
			case 'C-right':
			case 'right': {
				if ((value || '').length === 0) {
					this.handleNavigateForward();
				}
				break;
			}
			case 'tab':
				this.handleNavigateForward();
				break;
			case 'left':
			case 'C-left': {
				if ((value || '').length === 0) {
					this.handleNavigateBackward();
				}
				break;
			}
			case 'S-tab':
				this.handleNavigateBackward();
				break;
			case 'up':
				this.handleNavigateUp();
				break;
			case 'down':
				this.handleNavigateDown();
				break;
			case 'C-e':
				this.handleNavigateLineEnd();
				break;
			case 'C-a':
				this.handleNavigateLineStart();
				break;
			case 'backspace':
				this.handleDeletion();
				break;
			default:
				this.handleInsertion(data);
				break;
		}  */
	}

	render() {
		const {
			focused,
			body,
			footer,
			type,
			scope,
			subject
		} = this.props;

		const bodyHeight = Math.max(0, (body.children || '').split('\n').length);
		const bodyOffset = bodyHeight > 0 ? bodyHeight + 1 : 0;

		const typeWidth = type.children ? type.children.length : 'type'.length;
		const scopeWidth = scope.children ? scope.children.length : 'scope'.length;

		return (
			<form>
				<box>
					<Input
						{...type}
						value={type.children}
						top={0}
						name="type"
						placeholder="type"
						focus={focused === 'type'}
						width={typeWidth}
						/>
					<box left={typeWidth} width={1}>(</box>
					<Input
						{...scope}
						value={scope.children}
						top={0}
						left={typeWidth + 1}
						name="scope"
						placeholder="scope"
						focus={focused === 'scope'}
						width={scopeWidth}
						/>
					<box left={typeWidth + scopeWidth + 1} width={1}>)</box>
					<box left={typeWidth + scopeWidth + 2} width={1}>:</box>
					<Input
						{...subject}
						value={subject.children}
						top={0}
						left={typeWidth + scopeWidth + 4}
						name="subject"
						placeholder="subject"
						focus={focused === 'subject'}
						width={type.children ? type.children.length : 'subject'.length}
						/>
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
