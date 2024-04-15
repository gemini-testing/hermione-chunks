# @testplane/chunks

## Overview

Use the [@testplane/chunks][@testplane/chunks] plugin to run tests in parallel.

If your project has a large number of tests and at the same time there is not enough performance of concrete CI servers to perform all these tests on one server in an acceptable time, then this plugin is for you.

The plugin allows you to run tests in parallel on multiple servers. Thereby speeding up the overall test run. However, the plugin itself does not deal with any kind of orchestration, parallelization of the launch or merging of the resulting separate reports into one final report.

### What does this plugin do then?

The `@testplane/chunks` plugin splits **always in the same way** your tests into a given number of chunks and gives Testplane to run only the chunk that you specified. The key here is _"always in the same way"_. That is, the operation of splitting into chunks is [idempotent][idempotence].

### What gives idempotence?

You can setup your CI so as to reuse the results of test runs from separate chunks during a general restart. This will allow you to save time when restarting all tests, since only those chunks that have failed tests will be run.

For example, your project has 1 thousand tests. You have split these tests into 10 chunks of 100 tests each. This means that when you run tests in your pull request, you will have 10 Testplanes running simultaneously on 10 servers. Each Testplane will perform 100 tests. In some of these runs, the tests may fail. For example, 2 out of 10 chunks have failed. You decide to restart the test run, hoping that this time the tests will pass. So, when you restart Testplane with the number of the failed chunk, you can be absolutely sure that the `@testplane/chunks` plugin will generate exactly the same batch of tests for Testplane as in its last launch.

_When organizing the restart of tests in your CI, remember that in order to **re-use** runs of separate chunks, the initial number of tests, their names, or the number of browsers in which they are run should not change between runs. Otherwise, chunks in the new launch will not be the same as last time. And although formally you will get the same number of chunks as last time, their contents will be different. This means that reusing past results will be incorrect._

### How many times will my tests speed up?

You need to understand that acceleration is possible only due to the fact that tests will be run on more hardware.

If you do not have servers available that could be allocated for the parallel launch of several Testplanes at once, then it makes no sense to split the tests into the appropriate number of chunks. If CI waits for a server to be released in order to run the next chunk of tests, then your parallel launch will turn into a sequential one, and you will not get any acceleration. On the contrary, there will be a slowdown due to the overhead of separate launches of Testplane and the merging of the final report.

That is, parallelism &mdash; the number of chunks into which you split your tests &mdash; must necessarily be provided with the appropriate amount of available hardware.

### And how to get the final report?

Add to your project the [html-reporter][html-reporter] plugin.

Use the `merge-reports` command, which `html-reporter` adds to Testplane's [cli][cli] to merge all the reports obtained in separate chunks into one final report.

## Install

```bash
npm install -D @testplane/chunks
```

## Setup

Add the plugin to the `plugins` section of the Testplane config:

```javascript
module.exports = {
    plugins: {
        '@testplane/chunks': {
            count: 7, // Split tests to 7 chunks
            run: 1 // Run 1st chunk
        },

        // other Testplane plugins...
    },

    // other Testplane settings...
};
```

You don't have to set the _run_ parameter in the plugin config, since with parallel launches of Testplane, you will specify your chunk number _(run)_ for each launch. And this number will need to be passed either through a command line option or through an environment variable (see "Passing parameters via CLI").

### Description of configuration parameters

| **Parameter** | **Type** | **Default&nbsp;value** | **Description** |
| :--- | :---: | :---: | :--- |
| enabled | Boolean | true | Enable / disable the plugin. |
| count | Number | 1 | The number of chunks into which the tests should be split. |
| run | Number | 1 | The number of the chunk to run the tests from. |

### Passing parameters via the CLI

All plugin parameters that can be defined in the config can also be passed as command-line options or through environment variables during the launch of Testplane. Use the prefix `--chunks-` for command line options and `testplane_chunks_` for environment variables. For example:

```bash
npx testplane --chunks-count 10 --chunks-run 1
```

```bash
testplane_chunks_count=10 testplane_chunks_run=1 npx testplane
```

## Useful links

* [@testplane/chunks plugin sources][@testplane/chunks]
* [What is idempotence?][idempotence]

[html-reporter]: https://github.com/gemini-testing/html-reporter
[@testplane/chunks]: https://github.com/gemini-testing/testplane-chunks
[cli]: https://en.wikipedia.org/wiki/Command-line_interface
[idempotence]: https://en.wikipedia.org/wiki/Idempotence
