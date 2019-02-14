'use strict';

const is = exports.is = (type, name) => (value) => {
    if (typeof value !== type) {
        throw new Error(`"${name}" must be a ${type}`);
    }
};

exports.isPositiveInteger = (name) => (value) => {
    is('number', name)(value);

    if (value <= 0 || !Number.isInteger(value)) {
        throw new Error(`"${name}" must be a positive integer`);
    }
};
