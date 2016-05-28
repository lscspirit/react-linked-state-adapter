"use strict";

var AdaptedReactLink = function(value, requestChange, onValueChange, onCheckedChange) {
  this.value = value;
  this.requestChange = requestChange;
  this.onValueChange = onValueChange;
  this.onCheckedChange = onCheckedChange;
};

module.exports = AdaptedReactLink;