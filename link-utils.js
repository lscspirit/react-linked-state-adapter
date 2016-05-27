"use strict";

exports.getValue = function(link) {
  return link ? link.value : undefined;
};

exports.getOnChange = function(link) {
  if (link) {
    return function(e) {
      return link.requestChange(e.target.value);
    };
  }
  return undefined;
};

exports.getCheckedOnChange = function(link) {
  if (link) {
    return function(e) {
      return link.requestChange(e.target.checked);
    }
  }
  return undefined;
};