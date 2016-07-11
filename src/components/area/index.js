import React, {Component, PropTypes as t} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';

import {Editor} from 'react-blessed-editor';
import {noop} from 'lodash';

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
class Area extends Component {
	static styles = styles;

	static defaultProps = {
		onBlur: noop,
		onFocus: noop,
		focus: false,
		value: '',
		placeholder: ''
	};

	static propTypes = {
		top: t.number,
		value: t.string,
		placeholder: t.string,
		focus: t.bool,
		onBlur: t.func,
		onFocus: t.func,
		gutter: t.shape({
			hidden: t.bool
		})
	};

	handleBlur(data) {
		this.props.onBlur({
			props: this.props,
			data
		});
	}

	handleFocus(data) {
		this.props.onFocus({
			props: this.props,
			data
		});
	}

	render() {
		const {
			top,
			placeholder,
			focus
		} = this.props;

		return (
			<box
				top={top}
				>
				<Editor
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					keyable
					/>
				{
					/* placeholder */
					placeholder && !focus &&
						<box
							top={0}
							style={styles.placeholder}
							input={false}
							keyable={false}
							>
							{placeholder}
						</box>
				}
			</box>
		);
	}
}

export default Area;
