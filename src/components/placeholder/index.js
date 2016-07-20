import React, {Component, PropTypes as t} from 'react';
import pure from 'pure-render-decorator';

@pure
export class Placeholder extends Component {
	static propTypes = {
		children: t.string.isRequired,
		focus: t.bool,
		style: t.any,
		activeStyle: t.any
	};

	static defaultProps = {
		children: 'Placeholder',
		top: 0,
		left: 0,
		style: {
			bg: 'transparent',
			fg: 'grey'
		},
		activeStyle: {
			bg: '#42535b'
		}
	};

	render() {
		const {
			activeStyle,
			children,
			focus,
			...other
		} = this.props;

		return (
			<box {...other}>
				{children}
				{
					focus &&
						<box
							content={children[0]}
							top={0}
							left={0}
							width={1}
							height={1}
							style={activeStyle}
							/>
				}
			</box>
		);
	}
}

export default Placeholder;
