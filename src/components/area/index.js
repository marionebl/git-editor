import React, {Component, PropTypes} from 'react';
import pure from 'pure-render-decorator';
import autobind from 'autobind-decorator';
import {Editor} from 'editor-widget';
import {noop} from 'lodash';

/* function rangeMatches(range, ...rest) {
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

function detectNavigation(char, selection, buffer) {
	if (char.full === 'S-tab') {
		return {
			direction: 'previous',
			navigates: true
		};
	}

	const previousKey = ['S-tab', 'up', 'left'].includes(char.full);

	// TODO: tab?
	const nextKey = ['right', 'down'].includes(char.full);

	if (!previousKey && !nextKey) {
		return {
			direction: null,
			navigates: false
		};
	}

	const range = selection.getRange();
	const boundary = previousKey ? 'start' : 'end';
	const direction = previousKey ? 'previous' : 'next';

	if (rangeCollides(range, buffer, boundary)) {
		return {
			direction,
			navigates: true
		};
	}

	return {
		direction: null,
		navigates: false
	};
} */

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
		onNavigation: noop,
		value: '',
		placeholder: '',
		gutter: {
			hidden: true,
			style: {}
		}
	};

	static propTypes = {
		top: PropTypes.number,
		gutter: PropTypes.shape({
			hidden: PropTypes.bool
		})
	};

	saveNode(ref) {
		this.node = ref;
	}

	/* componentWillUpdate(next) {
		if (this.editor) {
			if (next.value !== this.props.value) {
				// this.editor.textBuf.setText(next.value);
			}
		}
	}

	componentDidMount() {
		if (this.node) {
			const editor = new Editor({
				parent: this.node,
				text: this.props.value,
				gutter: {
					hidden: true
				},
				bindings: {
					indent: [] // Set "tab" free
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
	}

	handleFocus(data) {
		this.props.onFocus({
			target: this.node,
			props: this.props,
			data
		});

		console.log('focus input', `[name=${this.props.name}, value=${this.props.value}]`);
	}

	handleKeypress(_, data) {
		const {props, node: target} = this;
		const {textBuf: buffer, selection} = this.editor;
		const detection = detectNavigation(data, selection, buffer);
		const value = buffer.getText();

		if (detection.navigates) {
			this.props.onNavigation({
				target,
				props,
				data: detection
			});
		}

		this.props.onKeypress({
			target,
			props,
			data,
			value
		});
	}

	componentWillUnmount() {
		if (this.editor) {
			this.node.remove(this.editor);
		}
	} */

	render() {
		const {
			placeholder,
			value,
			gutter
		} = this.props;

		const editor = {
			gutter: {
				hidden: true
			}
		};

		return (
			<box top={this.props.top}>
				<Editor {...editor}/>
				{
					/* placeholder */
					placeholder && value.length === 0 ?
						<box
							top={0}
							style={styles.placeholder}
							input={false}
							keyable={false}
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
