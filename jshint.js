"use strict";

const reporter = require("./sidekick_reporter").reporter;
const baseConfig = require("./config/jshint.json");

const sidekickAnalyser = require("sidekick-analyser");
const stripJsonComments = require("strip-json-comments");

const JSHint = require("jshint").JSHINT;

const configFileName = '.jshintrc';

if(require.main === module) {
  execute();
}
module.exports = exports = execute;

function execute() {
  sidekickAnalyser(function(setup) {
    var config;

    var conf = (setup.configFiles || {})[configFileName];
    if(conf) {
      try {
        config = JSON.parse(stripJsonComments(conf));
      } catch(e) {
        // FIXME need some way of signalling
        console.error("can't parse config");
        console.error(e);
      }
    }

    if(!config) {
      config = baseConfig;
    }

    run(setup.content, config);
  });
}

function run(content, config) {
  var results = [];

  content = content.replace(/^\uFEFF/, "");  // Remove potential Unicode BOM.
  var globals = config.globals;
  delete config.globals;
  delete config.prereq;
  delete config.overrides;

  if (!JSHint(content, config, globals)) {
    JSHint.errors.forEach(function (err) {
      if (err) {
        results.push({ error: err });
      }
    });
  }
  reporter(results);
}
