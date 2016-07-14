import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';
import {noop} from 'lodash';

import Focusable from '../focusable';
import Placeholder from '../placeholder';

const styles = {
	default: {
		fg: 'white'
	},
	placeholder: {
		fg: 'grey'
	}
};

@pure
@autobind
class Input extends Component {
	static styles = styles;

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
		style: {}
	};

	saveNode(ref) {
		this.node = ref.node || ref;
	}

	handleKeypress(_, data) {
		const {props, node: target} = this;
		props.onKeypress({target, props, data});
	}

	render() {
		const {
			focus,
			value: passed,
			placeholder,
			...other
		} = this.props;

		const value = passed || '';

		return (
			<box
				{...other}
				input={false}
				keyable={false}
				>
				{/* actual textual input */}
				<Focusable
					style={styles.default}
					{...other}
					left={0}
					top={0}
					component="textbox"
					inputOnFocus={false}
					onKeypress={this.handleKeypress}
					ref={this.saveNode}
					value={value}
					/>
				{/* placeholder */}
				{
					placeholder && value.length === 0 ?
						<Placeholder
							focus={false}
							style={styles.placeholder}
							>
							{placeholder}
						</Placeholder> :
						null
				}
				{/* cursor */}
				{
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

export default Input;
