'use strict';

const config = require('./lib/config');
const Chunks = require('./lib/chunks');

module.exports = (hermione, options) => {
    options = config(options);

    if (!options.enabled) {
        return;
    }

    if (hermione.isWorker()) {
        return;
    }

    hermione.on(hermione.events.AFTER_TESTS_READ, (testCollection) => {
        const chunks = Chunks.create(options);

        testCollection.eachTest((test) => chunks.addTest(test));

        chunks.get().forEach((chunk, index) => {
            if (++index !== options.run) {
                chunk.forEach((test) => testCollection.disableTest(test.fullTitle(), test.browserId));
            }
        });
    });
};

