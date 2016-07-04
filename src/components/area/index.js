import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
import Editor from 'editor-widget';
import autobind from 'autobind-decorator';
import {noop} from 'lodash';

function rangeMatches(range, ...rest) {
	const [row, column] = rest;

	const rowSatisfied = typeof row === 'number' ? range.start.row === row : true;

	const columnSatisfied = typeof column === 'number' ?
		range.start.column === column :
		true;

	return rowSatisfied && columnSatisfied;
}

function rangeEmpty(range) {
	const {start, end} = range;
	return end.row === start.row && end.column === start.column;
}

function rangeCollides(range, textBuffer, token) {
	if (token === 'start') {
		return rangeMatches(range, 0, 0) && rangeEmpty(range);
	}
	if (token === 'end') {
		const lastRow = textBuffer.getLastRow();
		const line = textBuffer.lineForRow(lastRow);
		const lastColumn = line.length;
		return rangeMatches(range, lastRow, lastColumn) && rangeEmpty(range);
	}
}

const styles = {
	default: {
		fg: 'white'
	},
	placeholder: {
		fg: 'grey'
	}
};

@pure
@autobind
class Area extends Component {
	static styles = styles;

	static defaultProps = {
		onBlur: noop,
		onFocus: noop,
		onKeypress: noop,
		value: '',
		placeholder: ''
	};

	saveNode(ref) {
		this.node = ref;
	}

	componentDidMount() {
		if (this.node) {
			const editor = new Editor({
				focusable: true,
				parent: this.node,
				text: this.props.value,
				gutter: {
					hidden: true
				},
				bindings: {
					indent: [] // Set "tab" free
				}
			});

			const {selection, textBuf: textBuffer} = editor;

			editor.on('keypress', (_, char) => {

				if (char.full === 'S-tab') {
					console.log(`${Date.now()}: previous - ${char.full}`);
				}

				const previousKey = ['S-tab', 'up', 'left'].includes(char.full);

				// TODO: tab?
				const nextKey = ['right', 'down'].includes(char.full);

				if (!previousKey && !nextKey) {
					return;
				}

				const range = selection.getRange();
				const boundary = previousKey ? 'start' : 'end';
				const direction = previousKey ? 'previous' : 'next';

				if (rangeCollides(range, textBuffer, boundary)) {
					console.log(`${Date.now()}: ${direction} - ${char.full}`);
				}
			});

			// TODO: handle line breaks
			editor.on('keypress', this.handleKeypress);
			editor.on('focus', this.handleFocus);
			editor.on('blur', this.handleBlur);
			this.editor = editor;
		}
	}

	handleBlur(data) {
		this.props.onBlur({
			target: this.node,
			props: this.props,
			data
		});

		console.log('blur input', `[name=${this.props.name}, value=${this.props.value}]`);
	}

	handleFocus(data) {
		this.props.onFocus({
			target: this.node,
			props: this.props,
			data
		});

		console.log('focus input', `[name=${this.props.name}, value=${this.props.value}]`);
	}

	handleKeypress(_, character) {
		this.props.onKeypress({
			target: this.node,
			props: this.props,
			data: character
		});
	}

	componentWillUnmount() {
		if (this.editor) {
			this.node.remove(this.editor);
		}
	}

	render() {
		const {
			placeholder,
			value
		} = this.props;

		return (
			<box>
				<box
					{...this.props}
					ref={this.saveNode}
					/>
					{
						/* placeholder */
						placeholder && value.length === 0 ?
							<box
								style={styles.placeholder}
								input={false}
								keyable={false}
								top={0}
								left={0}
								>
								{placeholder}
							</box> :
							null
					}
			</box>
		);
	}
}

export default Area;
