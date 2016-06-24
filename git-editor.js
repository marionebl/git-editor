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

    type.on('focus', function() {
      type.setValue('');
    })
    
    type.on('blur', function() {
      type.setValue('type');
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

    scope.on('focus', function() {
      scope.setValue('');
    });

    scope.on('blur', function() {
      scope.setValue('(scope):');
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

    type.focus();
    screen.render();
  });
}

module.exports = gitEditor;
