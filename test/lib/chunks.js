'use strict';

const Chunks = require('../../lib/chunks');
const {stubTest} = require('../utils');

describe('lib/chunks', () => {
    it('should distribute even number of tests on chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({id: 'foo'});
        const test2 = stubTest({id: 'bar'});

        chunks.addTest(test1);
        chunks.addTest(test2);

        assert.deepEqual(chunks.get(), [[test2], [test1]]);
    });

    it('should distribute odd number of tests on chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({id: 'foo'});
        const test2 = stubTest({id: 'bar'});
        const test3 = stubTest({id: 'baz'});

        chunks.addTest(test1);
        chunks.addTest(test2);
        chunks.addTest(test3);

        assert.deepEqual(chunks.get(), [[test2, test1], [test3]]);
    });

    it('should not distribute tests with the same id on different chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({id: 'foo'});
        const test2 = stubTest({id: 'foo'});

        chunks.addTest(test1);
        chunks.addTest(test2);

        assert.deepEqual(chunks.get(), [[test1, test2], []]);
    });

    it('should evenly distribute tests on chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({id: 'foo'});
        const test2 = stubTest({id: 'bar'});
        const test3 = stubTest({id: 'baz'});
        const test4 = stubTest({id: 'baz'});

        chunks.addTest(test1);
        chunks.addTest(test2);
        chunks.addTest(test3);
        chunks.addTest(test4);

        assert.deepEqual(chunks.get(), [[test3, test4], [test2, test1]]);
    });

    it('should not be affected by the order of the tests', () => {
        const chunks1 = Chunks.create({count: 2});
        const chunks2 = Chunks.create({count: 2});

        const test1 = stubTest({id: 'foo'});
        const test2 = stubTest({id: 'bar'});
        const test3 = stubTest({id: 'baz'});
        const test4 = stubTest({id: 'qux'});

        chunks1.addTest(test1);
        chunks1.addTest(test2);
        chunks1.addTest(test3);
        chunks1.addTest(test4);

        chunks2.addTest(test4);
        chunks2.addTest(test3);
        chunks2.addTest(test2);
        chunks2.addTest(test1);

        assert.deepEqual(chunks1.get(), chunks2.get());
    });
});
