import React, {Component, PropTypes as t} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';
import {noop} from 'lodash';

import Input from '../input';
import Area from '../area';

const placeholders = {
	type: 'type',
	scope: 'scope',
	subject: 'subject'
};

@pure
@autobind
class Form extends Component {
	static placeholders = placeholders;

	static propTypes = {
		onBlur: t.func,
		onFocus: t.func,
		onKeypress: t.func,
		onNavigateForward: t.func,
		onNavigateBackward: t.func,
		onNavigateForwardInfinity: t.func,
		onNavigateBackwardInfinity: t.func,
		onNavigateLineStart: t.func,
		onNavigateLineEnd: t.func,
		onNavigateUp: t.func,
		onNavigateDown: t.func,
		onInsertion: t.func,
		onDeletion: t.func,
		focused: t.string,
		type: t.any,
		scope: t.any,
		subject: t.any,
		body: t.any,
		footer: t.any
	};

	static defaultProps = {
		onNavigateForward: noop,
		onNavigateForwardInfinity: noop,
		onNavigateBackward: noop,
		onNavigateBackwardInfinity: noop,
		onNavigateLineStart: noop,
		onNavigateLineEnd: noop,
		onNavigateUp: noop,
		onNavigateDown: noop,
		onInsertion: noop,
		onDeletion: noop
	};

	nodes = {};
	attached = false;

	handleNavigateForward() {
		this.props.onNavigateForward();
	}

	handleNavigateBackward() {
		this.props.onNavigateBackward();
	}

	handleNavigateUp() {
		this.props.onNavigateUp();
	}

	handleNavigateDown() {
		this.props.onNavigateDown();
	}

	handleNavigateLineStart() {
		this.props.onNavigateLineStart();
	}

	handleNavigateLineEnd() {
		this.props.onNavigateLineEnd();
	}

	render() {
		const {
			focused,
			body,
			footer,
			type,
			scope,
			subject
		} = this.props;

		const bodyHeight = Math.max(0, (body.children || '').split('\n').length);
		const bodyOffset = bodyHeight > 0 ? bodyHeight + 1 : 0;

		const typeWidth = type.children ? type.children.length : 'type'.length;
		const scopeWidth = scope.children ? scope.children.length : 'scope'.length;

		const isHeaderFocused = ['type', 'scope', 'subject'].includes(focused);

		return (
			<box>
				<form>
					<box width="100%">
						<Input
							{...type}
							value={type.children}
							top={0}
							name="type"
							placeholder="type"
							focus={focused === 'type'}
							width={typeWidth}
							/>
						<box left={typeWidth} width={1}>(</box>
						<Input
							{...scope}
							value={scope.children}
							top={0}
							left={typeWidth + 1}
							name="scope"
							placeholder="scope"
							focus={focused === 'scope'}
							width={scopeWidth}
							/>
						<box left={typeWidth + scopeWidth + 1} width={1}>)</box>
						<box left={typeWidth + scopeWidth + 2} width={1}>:</box>
						<Input
							{...subject}
							value={subject.children}
							top={0}
							left={typeWidth + scopeWidth + 4}
							name="subject"
							placeholder="subject"
							focus={focused === 'subject'}
							/>
						<box top={2} left={0}>
							<Area
								{...body}
								value={body.children}
								top={0}
								name="body"
								placeholder="Body"
								focus={focused === 'body'}
								/>
							<Area
								{...footer}
								value={footer.children}
								top={bodyOffset}
								name="footer"
								placeholder="Footer"
								focus={focused === 'footer'}
								/>
						</box>
					</box>
				</form>
				{/* status line */}
				<box
					height={1}
					bottom={0}
					style={{fg: 'grey', border: {fg: 'grey'}}}
					>
					{
						[
							`${focused}: ∞/∞`,
							isHeaderFocused && `header: ∞/∞`
						]
							.filter(Boolean).join(' | ')
					}
				</box>
			</box>
		);
	}
}

export default Form;
