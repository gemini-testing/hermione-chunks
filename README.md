# hermione-chunks [![Build Status](https://travis-ci.org/gemini-testing/hermione-chunks.svg?branch=master)](https://travis-ci.org/gemini-testing/hermione-chunks)

Plugin for [hermione](https://github.com/gemini-testing/hermione) to run separate chunks of tests.

## Install

```bash
$ npm install hermione-chunks
```

## Usage

Add the plugin configuration file:

```js
module.exports = {
    plugins: {
        // the configuration below makes hermione distribute all tests on 7 chunks and run only the 1st chunk
        'hermione-chunks': {
            count: 7,
            run: 1
        }
    }
};
```
