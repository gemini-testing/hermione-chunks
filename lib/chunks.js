'use strict';

const _ = require('lodash');

module.exports = class Chunks {
    static create(...args) {
        return new Chunks(...args);
    }

    constructor(options) {
        this._tests = new Map();
        this._options = options;
    }

    addTest(test) {
        const tests = this._tests.get(test.id);
        if (tests) {
            tests.push(test)
        } else {
            this._tests.set(test.id, [test]);
        }
    }

    get() {
        const chunks = [];
        for (let i = 0; i < this._options.count; ++i) {
            chunks.push([]);
        }

        Array.from(this._tests.values())
            .sort((a, b) => b.length - a.length)
            .forEach((tests) => {
                const chunk = _.minBy(chunks, 'length');
                tests.forEach((test) => chunk.push(test));
            });

        return chunks;
    }
};
