'use strict';

const {root, section} = require('gemini-configparser');
const options = require('./options');

const ENV_PREFIX = 'testplane_chunks_';
const CLI_PREFIX = '--chunks-';

const parse = root(section({
    enabled: options.boolean('enabled'),
    count: options.positiveInteger('count'),
    run: options.positiveInteger('run')
}), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});

module.exports = (options) => parse({options, env: process.env, argv: process.argv});
