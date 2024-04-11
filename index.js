'use strict';

const config = require('./lib/config');
const Chunks = require('./lib/chunks');

module.exports = (testplane, options) => {
    options = config(options);

    if (!options.enabled) {
        return;
    }

    if (testplane.isWorker()) {
        return;
    }

    testplane.on(testplane.events.AFTER_TESTS_READ, (testCollection) => {
        const chunks = Chunks.create(options);

        testCollection.eachTest((test) => chunks.addTest(test));

        chunks.get().forEach((chunk, index) => {
            if (index + 1 !== options.run) {
                chunk.forEach((test) => test.disabled = true);
            }
        });
    });
};
