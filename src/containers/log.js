import React, {Component} from 'react';
import {connect} from 'react-redux';

import Log from '../components/log';

class LogContainer extends Component {
	render() {
		return <Log {...this.props}/>;
	}
}

function mapState(state) {
	return {
		toScreen: state.environment === 'development',
		content: state.log.join('\n')
	};
}

const ConnectedLogContainer = connect(mapState)(LogContainer);
export default ConnectedLogContainer;
