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

	componentDidMount() {
		const {node, props} = this;
		const {focus} = props;

		if (node && focus === true) {
			node.focus();
		}

		if (node && focus === true && global.screen) {
			global.screen.focusPush(this.node);
		}
	}

	handleBlur() {
		const {props, node: target} = this;
		props.onBlur({target, props});
	}

	handleFocus() {
		const {props, node: target} = this;
		props.onFocus({target, props});
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
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				ref={this.saveNode}
				keyable
				>
				{children}
			</Wrapper>
		);
	}
}

export default Focusable;
