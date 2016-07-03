const React = require('react');
const Component = require('react').Component;
const connect = require('react-redux').connect;

const form = require('../components/form');
const Form = form;

class Application extends Component {
	render() {
		return <Form {...this.props}/>;
	}
}

function mapProps(state) {
	return {
		environment: state.environment,
		form: state.form
	};
}

function mapDispatch(dispatch) {
	return {
		onBlur: dispatch,
		onFocus: dispatch,
		onKeypress: dispatch
	};
}

export default connect(mapProps, mapDispatch)(Application);
