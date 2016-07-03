const React = require('react');
const Component = require('react').Component;
const PropTypes = require('react').PropTypes;
const pure = require('pure-render-decorator');
const autobind = require('autobind-decorator');

const area = require('../area');
const Area = area;

const input = require('../input');
const Input = input;

const log = require('../log');
const Log = log;

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
		// Autofocus first field
		console.log('Setting autofocus...');
		this.nodes.form.focus();
		this.nodes.form.focusNext();
	}

	@autobind
	handleBlur(e) {
		this.props.onBlur({
			type: 'blur',
			payload: e.props.name
		});
	}

	@autobind
	handleFocus(e) {
		this.props.onFocus({
			type: 'focus',
			payload: e.props.name
		});
	}

	@autobind
	handleKeypress(e) {
		this.props.onKeypress({
			type: 'keypress',
			payload: {
				name: e.props.name,
				data: e.data,
				focused: e.target.focused
			}
		});
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
					{/*<box top={2}>
						<Area
							name="body"
							placeholder="Body"
							/>
					</box>
					<box top={4}>
						<Area
							name="footer"
							placeholder="Footer"
							/>
					</box>*/}
				</box>
				<Log/>
			</form>
		);
	}
}

module.exports = Form;
