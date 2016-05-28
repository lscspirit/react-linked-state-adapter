"use strict";

var AdaptedReactLink = require('./adapted-react-link');
var LinkUtils = require('./link-utils');

var AdaptedLinkedStateMixin = {
  linkState : function(key) {
    var cache = this.__linkedStates || (this.__linkedStates = {});

    var cachedLink = cache[key];
    if (cachedLink) {
      // returns the cached AdaptedReactLink if the value remains the same
      // only create a new AdaptedReactLink if the value chagned
      if (cachedLink.value == this.state[key]) return cachedLink;

      // creates a new AdaptedReactLink but reuses the various functions
      return cache[key] = new AdaptedReactLink(
        this.state[key],
        cachedLink.requestChange,
        cachedLink.onValueChange,
        cachedLink.onCheckedChange
      );
    } else {
      return cache[key] = new AdaptedReactLink(
        this.state[key],
        createRequestChange(this, key),
        createOnValueChange(this, key),
        createOnCheckedChange(this, key)
      );
    }
  },

  adaptReactLink : function(link) {
    // return the link as is if it is a AdaptedReactLink already
    if ("onValueChange" in link && "onCheckedChange" in link) return link;

    var cache = this.__adaptedLinks || (this.__adaptedLinks = []);

    // uses the link's requestChange function as a key to cache
    // the AdaptedReactLink
    var cachedLink = null;
    for (var i = 0; i < cache.length; i++) {
      cachedLink = cache[i];
      if (cachedLink.requestChange == link.requestChange) {
        // returns the cached link if the link's value remains the same
        // otherwise creates a new link with the new value, but reuses the change handlers
        return cachedLink.value == link.value ? cachedLink :
          new AdaptedReactLink(
            link.value,
            cachedLink.requestChange,
            cachedLink.onValueChange,
            cachedLink.onCheckedChange
          );
      }
    }

    // creates a new link if cache is not found
    cachedLink = new AdaptedReactLink(
      link.value,
      link.requestChange,
      LinkUtils.getOnValueChange(link),
      LinkUtils.getOnCheckedChange(link)
    );

    // adds the link to the cache
    cache.push(cachedLink);

    return cachedLink
  }
};

//
// Exports
//

module.exports = AdaptedLinkedStateMixin;

//
// Private Methods
//

function createRequestChange(component, key) {
  var partialState = {};
  return function requestChange(val) {
    partialState[key] = val;
    component.setState(partialState);
  };
}

function createOnValueChange(component, key) {
  var partialState = {};
  return function onValueChange(event) {
    partialState[key] = event.target.value;
    component.setState(partialState);
  };
}

function createOnCheckedChange(component, key) {
  var partialState = {};
  return function onCheckedChange(event) {
    partialState[key] = event.target.checked;
    component.setState(partialState);
  };
}