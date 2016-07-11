import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';

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

function getFieldOffset(name, form) {
	const {focused} = form;
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
class Form extends Component {
	static placeholders = placeholders;

	static propTypes = {
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		onKeypress: PropTypes.func,
		form: PropTypes.any
	};

	constructor(props, context) {
		super(props, context);
		this.nodes = {};
	}

	componentDidMount() {
		// TODO: Send this to store and maintain a focusIndex instead
		console.log('Setting autofocus...');
		this.nodes.form.focus();
		this.nodes.form.focusNext();
	}

	@autobind
	handleBlur(e) {
		this.props.onBlur({
			type: `INPUT_BLUR`,
			payload: e.props.name
		});
	}

	@autobind
	handleFocus(e) {
		this.props.onFocus({
			type: `INPUT_FOCUS`,
			payload: e.props.name
		});
	}

	@autobind
	handleKeypress(e) {
		this.props.onKeypress({
			type: `INPUT_KEYPRESS`,
			payload: {
				name: e.props.name,
				data: e.data,
				focused: e.target.focused,
				value: e.value
			}
		});
	}

	@autobind
	handleNavigation(e) {
		const {direction} = e.data;
		// TODO: Send this to store and maintain a focusIndex instead
		if (direction === 'next') {
			this.nodes.form.focusNext();
		}
		if (direction === 'previous') {
			this.nodes.form.focusPrevious();
		}
	}

	@autobind
	saveNode(name) {
		return ref => {
			this.nodes[name] = ref;
		};
	}

	render() {
		const {form} = this.props;
		const {focused} = form;

		const typeOffset = getFieldOffset('type', form);
		const scopeOffset = typeOffset + getFieldOffset('scope', form);
		const bodyHeight = Math.max(0, (form.body || '').split('\n').length);
		const bodyOffset = bodyHeight > 0 ? bodyHeight + 1 : 0;

		return (
			<form ref={this.saveNode('form')} keys>
				<box>
					<box>
						<Input
							name="type"
							placeholder="type"
							focus={focused === 'type'}
							ref={this.saveNode('type')}
							value={form.type}
							onBlur={this.handleBlur}
							onFocus={this.handleFocus}
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
							onBlur={this.handleBlur}
							onFocus={this.handleFocus}
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
							onBlur={this.handleBlur}
							onFocus={this.handleFocus}
							onKeypress={this.handleKeypress}
							/>
					</box>
					<box top={2}>
						<Area
							top={0}
							name="body"
							placeholder="Body"
							/>
						<Area
							top={bodyOffset}
							name="footer"
							placeholder="Footer"
							/>
					</box>
				</box>
			</form>
		);
	}
}

export default Form;
