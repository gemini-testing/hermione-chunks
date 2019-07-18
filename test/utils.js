'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');

exports.stubTest = (opts = {}) => {
    return _.defaults(opts, {
        fullTitle: () => opts.title || 'title',
        browserId: 'bro'
    });
};

exports.stubHermione = () => {
    return _.extend(new EventEmitter(), {
        isWorker: sinon.stub().returns(false),
        events: {
            AFTER_TESTS_READ: 'fooBarAfterTestsRead'
        },
        config: {
            getBrowserIds: sinon.stub().returns([]),
            forBrowser: sinon.stub().callsFake(() => {})
        }
    });
};
