'use strict';

const option = require('gemini-configparser').option;
const _ = require('lodash');
const defaults = require('./defaults');
const {is, isPositiveInteger} = require('./asserts');

module.exports = {
    boolean: (name) => formatOption(name, is('boolean', name)),
    positiveInteger: (name) => formatOption(name, isPositiveInteger(name))
};

function formatOption(name, validate, {parse} = {parse: JSON.parse}) {
    return option(Object.assign({parseEnv: parse, parseCli: parse}, {
        defaultValue: _.get(defaults, name),
        validate
    }));
}
