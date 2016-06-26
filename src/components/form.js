const React = require('react');
const Component = require('react').Component;

const area = require('./area');
const Area = area;

const input = require('./input');
const Input = input;

class Form extends Component {
  componentDidMount() {
    const form = this.refs.form;
    if (form) {
      form.focus();
    }
  }
  render() {
    return (
      <form ref="form" inputOnFocus="true" keys="true">
        <box>
          <Input placeholder="type" />
          <text left={'type'.length}>(</text>
          <Input
            left={'type'.length + 1}
            placeholder="scope"
            />
          <text left={'type'.length + 'scope'.length + 1}>)</text>
          <text left={'type'.length + 'scope'.length + 2}>:</text>
          <text left={'type'.length + 'scope'.length + 3}> </text>
          <Input
            left={'type'.length + 'scope'.length + 4}
            placeholder="subject"
            />
        </box>
        <box top={2}>
          <Area placeholder="Body" />
        </box>
        <box top={4}>
          <Area placeholder="Footer" />
        </box>
      </form>
    );
  }
}

module.exports = Form;
