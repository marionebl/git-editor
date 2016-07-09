import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';

import Area from '../area';
import Input from '../input';
import LogContainer from '../../containers/log';

const types = {
	box: 'AREA',
	default: 'INPUT',
	textbox: 'INPUT'
};

const placeholders = {
	type: 'type',
	scope: 'scope',
	subject: 'subject'
};

function getType(token) {
	return types[token] || types.default;
}

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
		const type = getType(e.target.type);
		this.props.onBlur({
			type: `${type}_BLUR`,
			payload: e.props.name
		});
	}

	@autobind
	handleFocus(e) {
		const type = getType(e.target.type);
		this.props.onFocus({
			type: `${type}_FOCUS`,
			payload: e.props.name
		});
	}

	@autobind
	handleKeypress(e) {
		const type = getType(e.target.type);
		this.props.onKeypress({
			type: `${type}_KEYPRESS`,
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
		const bodyOffset = Math.max(1, (form.body || '').split('\n').length);
		// console.log(JSON.stringify(form));

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
							focus={focused === 'body'}
							ref={this.saveNode('body')}
							value="function() { console.log('!'); }"
							onBlur={this.handleBlur}
							onFocus={this.handleFocus}
							onKeypress={this.handleKeypress}
							onNavigation={this.handleNavigation}
							/>
							{/* }<Area
								top={bodyOffset + 1}
								name="body"
								placeholder="Foooo"
								focus={focused === 'body'}
								ref={this.saveNode('body')}
								value={form.body}
								onBlur={this.handleBlur}
								onFocus={this.handleFocus}
								onKeypress={this.handleKeypress}
								onNavigation={this.handleNavigation}
								/> */}
					</box>
				</box>
				{/*<LogContainer/>*/}
			</form>
		);
	}
}

export default Form;
