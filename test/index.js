'use strict';

const plugin = require('../');
const Chunks = require('../lib/chunks');
const defaults = require('../lib/config/defaults');
const {stubTestplane, stubTest} = require('./utils');

describe('testplane-chunks', () => {
    const sandbox = sinon.sandbox.create();
    let testplane;

    const initPlugin = (config = {}) => plugin(testplane, config);

    const stubCollection = (tests = [{}]) => ({
        eachTest: (cb) => tests.forEach((test) => cb(test))
    });

    const emitAfterTestsRead = (collection, config) => {
        initPlugin(config);

        testplane.emit(testplane.events.AFTER_TESTS_READ, collection);
    };

    beforeEach(() => {
        sandbox.spy(Chunks, 'create');
        sandbox.stub(Chunks.prototype, 'addTest');
        sandbox.stub(Chunks.prototype, 'get').returns([]);

        testplane = stubTestplane();
        sandbox.spy(testplane, 'on');
        sandbox.stub(testplane, 'isWorker').returns(false);
    });

    afterEach(() => sandbox.restore());

    it('should do nothing if plugin is disabled', () => {
        initPlugin({enabled: false});

        assert.notCalled(testplane.on);
    });

    it('should do nothing in workers', () => {
        testplane.isWorker.returns(true);

        initPlugin({enabled: true});

        assert.notCalled(testplane.on);
    });

    describe('on "AFTER_TESTS_READ"', () => {
        it('should create "Chunks" instance', () => {
            emitAfterTestsRead(stubCollection(), defaults);

            assert.calledOnceWith(Chunks.create, defaults);
        });

        it('should add tests to "Chunks" instance', () => {
            const test1 = stubTest();
            const test2 = stubTest();

            emitAfterTestsRead(stubCollection([test1, test2]));

            assert.calledTwice(Chunks.prototype.addTest);
            assert.calledWith(Chunks.prototype.addTest, test1);
            assert.calledWith(Chunks.prototype.addTest, test2);
        });

        it('should disable all tests except the tests of the specified chunk', () => {
            const test1 = stubTest({id: 'test1'});
            const test2 = stubTest({id: 'test2'});
            const test3 = stubTest({id: 'test3'});
            const collection = stubCollection();
            Chunks.prototype.get.returns([[test1, test2], [test3]]);

            emitAfterTestsRead(collection, {run: 2});

            assert.propertyVal(test1, 'disabled', true);
            assert.propertyVal(test2, 'disabled', true);
        });
    });
});
