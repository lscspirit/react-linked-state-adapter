"use strict";

import assign from 'object-assign';

//
// Mock React Component State
//

function MockState(initial) {
  var _state = initial || {};
  var _stateSettters = {};

  this.get = function(key) {
    return _state[key];
  };

  this.setState = function(states) {
    assign(_state, states);
  };

  this.linkState = function(key) {
    return {
      value: this.get(key),
      requestChange: _getStateSetter(key)
    };
  };

  //
  // Private Method
  //

  function _getStateSetter(key) {
    return _stateSettters[key] || (_stateSettters[key] = function(val) { _state[key] = val; });
  }
}

module.exports = MockState;