'use strict';

const _ = require('lodash');

module.exports = class Chunks {
    static create(...args) {
        return new Chunks(...args);
    }

    constructor(options) {
        this._tests = [];
        this._options = options;
    }

    addTest(test) {
        this._tests.push(test);
    }

    get() {
        const chunks = [];
        for (let i = 0; i < this._options.count; ++i) {
            chunks.push([]);
        }

        _(this._tests)
            .groupBy((test) => test.fullTitle())
            .values()
            .sort((a, b) => b.length - a.length)
            .forEach((tests) => {
                const chunk = _.minBy(chunks, 'length');
                tests.forEach((test) => chunk.push(test));
            });

        return chunks;
    }
};
