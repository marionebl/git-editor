const combineReducers = require('redux').combineReducers;

const debug = require('./debug');
const environment = require('./environment');
const form = require('./form');
const log = require('./log');
const validate = require('./validate');

module.exports = combineReducers({
	debug,
	environment,
	form,
	log,
	validate
});
