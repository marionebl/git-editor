const combineReducers = require('redux').combineReducers;

const environment = require('./environment');
const form = require('./form');
const log = require('./log');
const validate = require('./validate');

module.exports = combineReducers({
	environment,
	form,
	log,
	validate
});
