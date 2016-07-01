const React = require('react');
const Component = require('react').Component;
const PropTypes = require('react').PropTypes;
const noop = require('lodash').noop;
const pure = require('pure-render-decorator');
const autobind = require('autobind-decorator');

const styles = {
	placeholder: {
		fg: 'grey',
		bg: 'transparent'
	}
};

@pure
@autobind
class Input extends Component {
	static propTypes = {
		focus: PropTypes.bool,
		placeholder: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		style: PropTypes.any,
		value: PropTypes.string,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		onKeypress: PropTypes.func
	};

	static defaultProps = {
		onBlur: noop,
		onFocus: noop,
		onKeypress: noop,
		value: '',
		placeholder: '',
		style: {
			bg: 'transparent',
			focus: {
				bg: 'red'
			}
		}
	};

	constructor(props, context) {
		super(props, context);
		this.nodes = {};
	}

	componentDidMount() {
		if (this.props.focus && global.screen) {
			this.node.focus();
			global.screen.focusPush(this.node);
		}
	}

	saveNode(node) {
		this.node = node;
	}

	handleBlur(data) {
		this.props.onBlur({
			target: this.node,
			props: this.props,
			data
		});

		console.log('blur input', `[name=${this.props.name}, value=${this.props.value}]`);
	}

	handleFocus(data) {
		this.props.onFocus({
			target: this.node,
			props: this.props,
			data
		});

		console.log('focus input', `[name=${this.props.name}, value=${this.props.value}]`);
	}

	handleKeypress(_, character) {
		this.props.onKeypress({
			target: this.node,
			props: this.props,
			data: character
		});
	}

	render() {
		const {
			focus,
			value: passed,
			placeholder
		} = this.props;

		const value = passed || '';

		return (
			<box
				{...this.props}
				input={false}
				keyable={false}
				>
				{/* actual textual input */}
				<textbox
					value={value}
					{...this.props}
					top={0}
					left={0}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onKeypress={this.handleKeypress}
					ref={this.saveNode}
					inputOnFocus={false}
					style={{bg: 'transparent'}}
					/>
				{
					/* placeholder */
					placeholder && value.length === 0 ?
						<box
							style={styles.placeholder}
							input={false}
							keyable={false}
							top={0}
							left={0}
							>
							{placeholder}
						</box> :
						null
				}
				{
					/* cursor */
					focus ?
						<box
							content={value ? ' ' : placeholder[0]}
							left={Math.max(0, value.length)}
							width={1}
							height={1}
							style={{bg: '#42535b'}}
							/> :
						null
				}
			</box>
		);
	}
}

module.exports = Input;
