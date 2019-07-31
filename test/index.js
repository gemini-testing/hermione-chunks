'use strict';

const plugin = require('../');
const Chunks = require('../lib/chunks');
const defaults = require('../lib/config/defaults');
const {stubHermione, stubTest} = require('./utils');

describe('hermione-chunks', () => {
    const sandbox = sinon.sandbox.create();
    let hermione;

    const initPlugin = (config = {}) => plugin(hermione, config);

    const stubCollection = (tests = [{}]) => ({
        eachTest: (cb) => tests.forEach((test) => cb(test))
    });

    const emitAfterTestsRead = (collection, config) => {
        initPlugin(config);

        hermione.emit(hermione.events.AFTER_TESTS_READ, collection);
    };

    beforeEach(() => {
        sandbox.spy(Chunks, 'create');
        sandbox.stub(Chunks.prototype, 'addTest');
        sandbox.stub(Chunks.prototype, 'get').returns([]);

        hermione = stubHermione();
        sandbox.spy(hermione, 'on');
        sandbox.stub(hermione, 'isWorker').returns(false);
    });

    afterEach(() => sandbox.restore());

    it('should do nothing if plugin is disabled', () => {
        initPlugin({enabled: false});

        assert.notCalled(hermione.on);
    });

    it('should do nothing in workers', () => {
        hermione.isWorker.returns(true);

        initPlugin({enabled: true});

        assert.notCalled(hermione.on);
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
            const test1 = stubTest({title: 'test1', browserId: 'bro1'});
            const test2 = stubTest({title: 'test2', browserId: 'bro2'});
            const test3 = stubTest({title: 'test3', browserId: 'bro1'});
            const collection = stubCollection();
            Chunks.prototype.get.returns([[test1, test2], [test3]]);

            emitAfterTestsRead(collection, {run: 2});

            assert.propertyVal(test1, 'disabled', true);
            assert.propertyVal(test2, 'disabled', true);
        });
    });
});
