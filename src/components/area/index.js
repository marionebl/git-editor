import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
// import autobind from 'autobind-decorator';

const style = {
	fg: 'grey',
	focus: {
		fg: 'white'
	}
};

@pure
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

export default Area;
