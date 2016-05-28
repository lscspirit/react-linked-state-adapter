"use strict";

var LinkUtils = require('./link-utils');
var warning   = require('warning');
var invariant = require('invariant');

var didWarnDeprecation = false;

var LinkedStateAdapter = {
  __getOnChange : function(link, isChecked) {
    var cache = isChecked === true ?
      ( this.__valueOnChanges || (this.__valueOnChanges = []) ) :
      ( this.__checkedOnChanges || (this.__checkedOnChanges = []) );

    for (var i = 0; i < cache.length; i++) {
      if (cache[i].fn == link.requestChange) return cache[i].onChange;
    }

    var onChange = isChecked === true ?
      LinkUtils.getCheckedOnChange(link) : 
      LinkUtils.getOnChange(link);
    cache.push({
      fn       : link.requestChange,
      onChange : onChange
    });

    return onChange;
  },

  componentWillMount : function() {
    _assertSingleLink(this.props);
  },

  componentWillReceiveProps : function(nextProps) {
    _assertSingleLink(nextProps);
  },

  value : function() {
    if (this.props.valueLink) {
      return LinkUtils.getValue(this.props.valueLink);
    }
    return this.props.value;
  },

  checked : function() {
    if (this.props.checkedLink) {
      return LinkUtils.getValue(this.props.checkedLink);
    }
    return this.props.checked;
  },

  onChange : function() {
    var self = this;

    if (this.props.onChange) {
      return this.props.onChange;
    } else if (this.props.valueLink) {
      return this.__getOnChange(this.props.valueLink);
    } else if (this.props.checkedLink) {
      return this.__getOnChange(this.props.checkedLink, true);
    }

    return undefined;
  }
};

//
// Exports
//

module.exports = LinkedStateAdapter;

//
// Helper Function
//

function _assertSingleLink(props) {
  invariant(
    props.valueLink == null || props.checkedLink == null,
    "Cannot provide both a 'valueLink' and a 'checkedLink' at the same time"
  );

  if (props.valueLink || props.checkedLink) {
    if (!didWarnDeprecation) {
      warning(false, "The use of 'valueLink' and 'checkedLink' is deprecated as of React v15");
      didWarnDeprecation = true;
    }

    invariant(
      props.valueLink == null || (props.value == null && props.onChange == null),
      "Cannot provide a 'valueLink' when there is a 'value' prop or 'onChange' event."
    );

    invariant(
      props.checkedLink == null || (props.checked == null && props.onChange == null),
      "Cannot provide a 'checkedLink' when there is a 'checked' prop or 'onChange' event."
    );
  }
}