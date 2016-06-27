const React = require('react');
const Component = require('react').Component;
const PropTypes = require('react').PropTypes;
const noop = require('lodash').noop;

const styles = {
	placeholder: {
		fg: 'grey',
		bg: 'transparent'
	}
};

class Input extends Component {
	static propTypes = {
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
		this.saveNode = this.saveNode.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleKeypress = this.handleKeypress.bind(this);
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

		console.log('blur input', `[name=${this.props.name}]`);
	}

	handleFocus(data) {
		this.props.onFocus({
			target: this.node,
			props: this.props,
			data
		});

		console.log('focus input', `[name=${this.props.name}]`);
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
			value,
			placeholder
		} = this.props;

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
