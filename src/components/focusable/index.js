import React, {Component, PropTypes as t} from 'react';
import autobind from 'autobind-decorator';

import {noop} from 'lodash';

@autobind
export class Focusable extends Component {
	static propTypes = {
		children: t.node,
		component: t.node.isRequired,
		focus: t.bool.isRequired,
		onBlur: t.func.isRequired,
		onFocus: t.func.isRequired
	};

	static defaultProps = {
		focus: false,
		onBlur: noop,
		onFocus: noop
	};

	node = null;

	saveNode(ref) {
		this.node = ref.node || ref;
	}

	render() {
		const {
			component: Wrapper,
			children,
			...other
		} = this.props;

		return (
			<Wrapper
				{...other}
				ref={this.saveNode}
				>
				{children}
			</Wrapper>
		);
	}
}

export default Focusable;
