/* jshint node: true */

var mergeTrees = require('broccoli-merge-trees');
// TODO(azirbel): This is deprecated
var pickFiles = require('broccoli-static-compiler');
// TODO(azirbel): Deprecated, remove and use es6modules
var compileES6 = require('broccoli-es6-concatenator');
var es3Safe = require('broccoli-es3-safe-recast');
var wrap = require('./wrap');
var globals = require('./globals');
var log = require('broccoli-stew').log;

var addonTree = pickFiles('addon', {
  srcDir: '/',
  destDir: 'ember-widgets'
});

// Does a few things:
//   - Generate global exports, like Ember.Table.EmberTableComponent
// Output goes into globals-output.js
var globalExports = globals(pickFiles(addonTree, {srcDir: '/ember-widgets', destDir: '/'}));

// Require.js module loader
// var loader = pickFiles('bower_components', {srcDir: '/loader.js', destDir: '/'});

// var jsTree = mergeTrees([globalExports, loader]);

// Transpile modules
// var compiled = compileES6(jsTree, {
  // wrapInEval: false,
  // loaderFile: 'loader.js',
  // inputFiles: [],
  // ignoredModules: ['ember'],
  // outputFile: '/ember-widgets.js',
  // legacyFilesToAppend: ['globals-output.js']
// });

// var logCompiled = log(compiled, { output: 'tree', label: 'compiled tree' });

// Wrap in a function which is executed
wrapped = wrap(globalExports);

var loggedWrapped = log(wrapped, { output: 'tree', label: 'wrapped tree' });

var es3SafeTree = es3Safe(loggedWrapped);

var loggedEs3Safe = log(es3SafeTree, { output: 'tree', label: 'es3 safe tree' });

module.exports = mergeTrees([loggedEs3Safe]);
