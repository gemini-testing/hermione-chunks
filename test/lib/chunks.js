'use strict';

const Chunks = require('../../lib/chunks');
const {stubTest} = require('../utils');

describe('lib/chunks', () => {
    it('should distribute even number of tests on chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({title: 'foo'});
        const test2 = stubTest({title: 'bar'});

        chunks.addTest(test1);
        chunks.addTest(test2);

        assert.deepEqual(chunks.get(), [[test1], [test2]]);
    });

    it('should distribute odd number of tests on chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({title: 'foo'});
        const test2 = stubTest({title: 'bar'});
        const test3 = stubTest({title: 'baz'});

        chunks.addTest(test1);
        chunks.addTest(test2);
        chunks.addTest(test3);

        assert.deepEqual(chunks.get(), [[test1, test3], [test2]]);
    });

    it('should not distribute tests with the same full title on different chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({title: 'foo', browserId: 'bro1'});
        const test2 = stubTest({title: 'foo', browserId: 'bro2'});

        chunks.addTest(test1);
        chunks.addTest(test2);

        assert.deepEqual(chunks.get(), [[test1, test2], []]);
    });

    it('should evenly distribute tests on chunks', () => {
        const chunks = Chunks.create({count: 2});
        const test1 = stubTest({title: 'foo', browserId: 'bro1'});
        const test2 = stubTest({title: 'bar', browserId: 'bro2'});
        const test3 = stubTest({title: 'baz', browserId: 'bro1'});
        const test4 = stubTest({title: 'baz', browserId: 'bro2'});

        chunks.addTest(test1);
        chunks.addTest(test2);
        chunks.addTest(test3);
        chunks.addTest(test4);

        assert.deepEqual(chunks.get(), [[test3, test4], [test1, test2]]);
    });
});
