const React = require('react');
const Children = require('react').Children;
const Component = require('react').Component;
const computeLayout = require('css-layout');
const _ = require('lodash');

const supported = [
	'width',
	'height',
	'minWidth',
	'minHeight',
	'top',
	'right',
	'bottom',
	'left',
	'margin',
	'marginLeft',
	'marginRight',
	'marginTop',
	'marginBottom',
	'padding',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'paddingBottom',
	'borderWidth',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'borderBottomWidth',
	'flexDirection',
	'justifyContent',
	'alignItems',
	'alignSelf',
	'flex',
	'flexWrap',
	'position',
	'overflow'
];

const blessedProperties = [
	'top',
	'right',
	'bottom',
	'left',
	'width',
	'height'
];

function getStyle(element) {
	const props = element.props;
	const style = _.pick(props.style || {}, supported);
	const blessedStyle = _.pick(props, blessedProperties);

	return _.merge({}, blessedStyle, style);
}

class FlexBox extends Component {
	compute() {
		const children = Children.map(this.props.children, child => {
			return {
				style: getStyle(child)
			};
		});

		const tree = _.merge({
			style: getStyle(this),
			children
		});

		computeLayout(tree);
		// console.log(tree);
		return tree;
	}

	render() {
		this.compute();

		return (
			<box {...this.props}>
				{this.props.children}
			</box>
		);
	}
}

module.exports = FlexBox;
