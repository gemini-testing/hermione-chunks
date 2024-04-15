'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');

exports.stubTest = (opts = {}) => {
    return _.defaults(opts, {
        id: 'default-id'
    });
};

exports.stubTestplane = () => {
    const testplane = new EventEmitter();
    testplane.isWorker = () => {};
    testplane.events = {
        AFTER_TESTS_READ: 'fooBarAfterTestsRead'
    };
    return testplane;
};
