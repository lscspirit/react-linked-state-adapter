"use strict";

var convertLink = require('./convert-link');
var warning   = require('warning');
var invariant = require('invariant');

var didWarnDeprecation = false;

var LinkedStateAdapter = {
  __getConvertedLink : function() {
    if (this.__convertedLink == undefined) {
      var link = this.props.valueLink || this.props.checkedLink;
      this.__convertedLink = link ? convertLink(link) : null;
    }

    return this.__convertedLink;
  },

  componentWillMount : function() {
    _assertSingleLink(this.props);
  },

  componentWillReceiveProps : function(nextProps) {
    _assertSingleLink(nextProps);

    if (this.props.valueLink != nextProps.valueLink || this.props.checkedLink != nextProps.checkedLink) {
      this.__convertedLink = undefined;
    }
  },

  value : function() {
    if (this.props.valueLink) {
      return this.__getConvertedLink().value;
    }
    return this.props.value;
  },

  checked : function() {
    if (this.props.checkedLink) {
      return this.__getConvertedLink().value;
    }
    return this.props.checked;
  },

  onChange : function() {
    var self = this;

    if (this.props.onChange) {
      return this.props.onChange;
    } else if (this.props.valueLink) {
      return this.__getConvertedLink().onChange;
    } else if (this.props.checkedLink) {
      return this.__getConvertedLink().checkedOnChange;
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