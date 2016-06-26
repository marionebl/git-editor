const React = require('react');
const Component = require('react').Component;
const render = require('react-blessed').render;

const Provider = require('react-redux').Provider;
const Form = require('./components/form');

const FormElement = Form;

function renderApplication(screen, store) {
  return render(
    <Provider store={store}>
      <FormElement />
    </Provider>,
    screen
  );
}

module.exports = renderApplication;
