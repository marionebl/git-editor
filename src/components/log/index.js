import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';

@pure
@autobind
class Log extends Component {
	static defaultProps = {
		content: '',
		top: '25%',
		right: '1%',
		bottom: '1%',
		left: '1%',
		width: '99%',
		height: '75%',
		border: {
			type: 'line'
		},
		style: {
			fg: 'grey',
			border: {
				fg: 'grey'
			}
		}
	};

	static propTypes = {
		toScreen: PropTypes.bool
	};

	render() {
		if (this.props.toScreen === false) {
			return <box top="100%" left="100%"/>;
		}
		return <log {...this.props}/>;
	}
}

export default Log;
