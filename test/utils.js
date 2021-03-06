'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');

exports.stubTest = (opts = {}) => {
    return _.defaults(opts, {
        id: 'default-id'
    });
};

exports.stubHermione = () => {
    const hermione = new EventEmitter();
    hermione.isWorker = () => {};
    hermione.events = {
        AFTER_TESTS_READ: 'fooBarAfterTestsRead'
    };
    return hermione;
};
