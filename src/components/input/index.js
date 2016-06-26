const React = require('react');
const Component = require('react').Component;

const style = {
  fg: 'grey',
  focus: {
    fg: 'white'
  }
};

class Input extends Component {
  render() {
    const {
      value,
      placeholder
    } = this.props;

    return (
      <textbox
        style={style}
        inputOnFocus
        value={value || placeholder}
        {...this.props}
        />
    );
  }
}

module.exports = Input;
