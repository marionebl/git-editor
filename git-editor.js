'use strict';
const blessed = require('blessed');
const Editor = require('editor-widget');
const Field = Editor.Field;

const fp = require('lodash/fp');

const defaults = {
  smartCSR: true,
  debug: true,
  ignoreLocked: ['C-c', 'C-s']
};

function gitEditor(input, options) {
  return new Promise(function(resolve, reject) {

    const settings = fp.merge(defaults)(options);
    const screen = blessed.screen(settings);
    global.screen = screen;

    const form = blessed.form({
      parent: screen,
      inputOnFocus: true,
      keys: true
    });

    const header = blessed.box({
      parent: form
    });

    const body = blessed.box({
      parent: form,
      top: 2 // calculated by header.lines
    });

    const footer = blessed.box({
      parent: form,
      top: 5 // calculated by header.lines + body.lines
    });

    const type = blessed.textbox({
      parent: header,
      value: 'type',
      top: 0,
      left: 0,
      inputOnFocus: true,
      style: {
        fg: 'grey',
        focus: {
          fg: 'white'
        }
      }
    });

    const scope = blessed.textbox({
      parent: header,
      value: '(scope):',
      top: 0,
      left: 4, // calculate by type.width
      inputOnFocus: true,
      style: {
        fg: 'grey',
        focus: {
          fg: 'white'
        }
      }
    });

    const subject = blessed.textbox({
      parent: header,
      value: 'subject',
      top: 0,
      left: 13, // calculate by type.width + scope.width
      inputOnFocus: true,
      style: {
        fg: 'grey',
        focus: {
          fg: 'white'
        }
      }
    });

    const offsets = Object.defineProperties({}, {
      0: {
        value: 0,
        writeable: false
      },
      1: {
        get: function() {
          return type.value.length;
        }
      },
      2: {
        get: function() {
          return type.value.length + scope.value.length;
        }
      }
    });


    type.on('focus', function() {
      if (type.value === 'type') {
        type.setValue('');
      }
    })

    type.on('keypress', function() {
      scope.left = offsets[1];
      subject.left = offsets[2];
    });
    
    type.on('blur', function() {
      if (type.value === '') {
        type.setValue('type');
        type.style.fg = 'grey';
      } else {
        type.style.fg = 'white';
      }

      scope.left = offsets[1];
      subject.left = offsets[2];
    });

    scope.on('focus', function() {
      scope.setValue('');
    });

    scope.on('keypress', function() {
      subject.left = offsets[2];
    });

    scope.on('blur', function() {
      if (scope.value === '') {
        scope.setValue('scope');
        scope.style.fg = 'grey';
      } else {
        scope.style.fg = 'white';
      }

      subject.left = offsets[2];
    });

    subject.on('focus', function() {
      subject.setValue('');
    });

    subject.on('blur', function() {
      subject.setValue('subject');
    });

    const message = blessed.textarea({
      parent: body,
      value: 'Message',
      inputOnFocus: true,
      style: {
        fg: 'grey',
        focus: {
          fg: 'white'
        }
      }
    });

    message.on('focus', function() {
      message.setValue('');
    });

    message.on('blur', function() {
      message.setValue('Message');
    });

    const meta = blessed.textarea({
      parent: footer,
      value: 'Footer',
      inputOnFocus: true,
      style: {
        fg: 'grey',
        focus: {
          fg: 'white'
        }
      }
    });

    meta.on('focus', function() {
      meta.setValue('');
    });

    meta.on('blur', function() {
      meta.setValue('Footer');
    });

    const inputs = [
      type,
      scope,
      subject,
      message,
      meta
    ];

    screen.key(['C-c'], function(character, key) {
      console.log('!!!');
      screen.destroy();
      resolve();
    });

    screen.key(['C-s'], function(character, key) {
      screen.destroy();
      resolve();
    });

    form.focus();
    screen.render();
  });
}

module.exports = gitEditor;
