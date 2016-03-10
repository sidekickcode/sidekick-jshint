"use strict";

var annotationDefaults = {analyserName: 'jshint'};

exports.reporter = function (results, data, opts) {
  console.log(JSON.stringify(transform(results, data, opts)));
};

function transform(results /*, data, opts */) {
  var issues = results.map(function(result) {
    var line = result.error.line - 1;
    return {
      analyserName: annotationDefaults.analyserName,
      location: {
        startLine: line,
        startCharacter: result.error.character,
        endLine: line,
        endCharacter: result.error.character,
      },
      message: result.error.reason,
      kind: result.error.code,
      debt: isError(result.error.code) ? 10 : 5
    };
  });
  return {
    meta: issues
  };
}

function isError(code) {
  return code[0] === "E";
}
