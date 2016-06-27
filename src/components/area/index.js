const React = require('react');
const Component = require('react').Component;

const style = {
	fg: 'grey',
	focus: {
		fg: 'white'
	}
};

class Area extends Component {
	render() {
		const {
			value,
			placeholder
		} = this.props;

		return (
			<textarea
				style={style}
				inputOnFocus
				value={value || placeholder}
				{...this.props}
				/>
		);
	}
}

module.exports = Area;
