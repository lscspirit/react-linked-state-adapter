"use strict";

var LinkUtils = require('./link-utils');
var invariant = require('invariant');

function convertLink(link) {
  _assertValidReactLink(link);

  return {
    value    : LinkUtils.getValue(link),
    onChange : LinkUtils.getOnChange(link),
    checkedOnChange : LinkUtils.getCheckedOnChange(link)
  };
}

//
// Exports
//

module.exports = convertLink;

//
// Helper functions
//

function _assertValidReactLink(react_link) {
  invariant(
    "value" in react_link,
    "A valid ReactLink object must have a 'value' property"
  );

  invariant(
    "requestChange" in react_link,
    "A valid ReactLink object must have a 'requestChange' property"
  );

  invariant(
    typeof react_link.requestChange === "function",
    "The 'requestChange' property of a valid ReactLink must be a function"
  );
}