import React, {Component, PropTypes as t} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';

import {Editor} from 'react-blessed-editor';
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
		left: t.number,
		value: t.string,
		placeholder: t.string,
		focus: t.bool,
		onBlur: t.func,
		onFocus: t.func,
		highlight: t.oneOfType([
			t.string,
			t.bool
		]),
		gutter: t.oneOfType([
			t.shape({
				hidden: t.bool
			}),
			t.bool
		])
	};

	nodes = {};

	render() {
		const {
			top,
			left,
			placeholder,
			value,
			focus,
			highlight,
			...other
		} = this.props;

		console.log({highlight});

		return (
			<box
				top={top}
				left={left}
				>
				<Focusable
					{...other}
					content={value}
					focus={focus}
					component={Editor}
					highlight={highlight}
					/>
					{/* placeholder */}
					{
						placeholder && value.length === 0 ?
							<Placeholder
								focus={focus}
								style={styles.placeholder}
								>
								{placeholder}
							</Placeholder> :
							null
					}
			</box>
		);
	}
}

export default Area;
