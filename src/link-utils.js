"use strict";

exports.getValue = function(link) {
  return link ? link.value : undefined;
};

exports.getOnValueChange = function(link) {
  if (link) {
    return function(e) {
      return link.requestChange(e.target.value);
    };
  }
  return undefined;
};

exports.getOnCheckedChange = function(link) {
  if (link) {
    return function(e) {
      return link.requestChange(e.target.checked);
    }
  }
  return undefined;
};