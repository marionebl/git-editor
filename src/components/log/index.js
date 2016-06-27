const React = require('react');
const Component = require('react').Component;
const PropTypes = require('react').PropTypes;

const connect = require('react-redux').connect;

class Log extends Component {
	static defaultProps = {
		content: '',
		top: '50%',
		right: '1%',
		bottom: '1%',
		left: '1%',
		width: '99%',
		height: '50%',
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
			return null;
		}
		return <log {...this.props}/>;
	}
}

function mapState(state) {
	return {
		toScreen: state.environment === 'development',
		content: state.log.join('\n')
	};
}

module.exports = connect(mapState)(Log);
