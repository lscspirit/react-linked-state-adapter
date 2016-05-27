"use strict";

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import LinkedStateAdapter from '../adapter';

const faker = require('faker');

//
// Specs
//

describe('LinkedStateAdapter', function() {
  //
  // Text Input
  //
  context('in a higher order text input component', function() {
    //
    // Value Link
    //
    context('using valueLink', function() {
      it('should set the input value to the "value" state', function() {
        assertSetValue(buildWrapper(TextInput, 'valueLink'), faker.lorem.sentence());
      });

      it('should update the "value" state when input changes', function() {
        assertValueUpdate(buildWrapper(TextInput, 'valueLink'), faker.lorem.sentence());
      });
    });

    //
    // Value and onChange
    //
    context('using "value" and "onChange" props', function() {
      it('should set the input value to the "value" state', function() {
        assertSetValue(buildWrapper(TextInput, 'value'), faker.lorem.sentence());
      });

      it('should update the "value" state when input changes', function() {
        assertValueUpdate(buildWrapper(TextInput, 'value'), faker.lorem.sentence());
      });
    });
  });

  //
  // Checkbox Input
  //
  context('in a higher order checkbox input component', function() {
    //
    // Checked Link
    //
    context('using checkedLink', function() {
      it('should set the checked property according to the "value" state', function() {
        assertSetChecked(buildWrapper(CheckboxInput, 'checkedLink'), faker.random.boolean());
      });

      it('should update the "value" state when toggled', function() {
        assertCheckedToggle(buildWrapper(CheckboxInput, 'checkedLink'), faker.random.boolean());
      });
    });

    //
    // Checked and onChange
    //
    context('using "checked" and "onChange" props', function() {
      it('should set the checked property according to the "value" state', function() {
        assertSetChecked(buildWrapper(CheckboxInput, 'checked'), faker.random.boolean());
      });

      it('should update the "value" state when toggled', function() {
        assertCheckedToggle(buildWrapper(CheckboxInput, 'checked'), faker.random.boolean());
      });
    });
  });
});

//
// Test methods for different types of input
//

function assertSetValue(WrapperElement, value) {
  // mount the wrapper element
  const wrapper = mount(<WrapperElement initialValue={ value }/>);

  // check the value props on the input element
  expect(wrapper.find('input').prop('value')).to.eq(value);
}

function assertValueUpdate(WrapperElement, newValue) {
  // mount the wrapper element
  const wrapper = mount(<WrapperElement/>);
  wrapper.find('input').simulate('change', { target: { value: newValue } });

  // check the latest value state of the wrapper
  expect(wrapper.state('value')).to.eq(newValue);
}

function assertSetChecked(WrapperElement, isChecked) {
  // mount the wrapper element
  const wrapper = mount(<WrapperElement initialValue={ isChecked }/>);

  // check the value props of the input element
  expect(wrapper.find('input').prop('checked')).to.eq(isChecked);
}

function assertCheckedToggle(WrapperElement, initialChecked) {
  // mount the wrapper element
  const wrapper = mount(<WrapperElement initialValue={ initialChecked }/>);
  // toggle the input
  wrapper.find('input').simulate('change', { target: { checked: !initialChecked } });

  // check the latest value in the wrapper
  expect(wrapper.state('value')).to.eq(!initialChecked);
}

//
// Wrapper Builder
//

function buildWrapper(Input, type) {
  return React.createClass({
    mixins : [LinkedStateAdapter],

    getInitialState : function() {
      return { value : ('initialValue' in this.props) ? this.props.initialValue : '' };
    },

    render : function() {
      if (type == 'valueLink') {
        return <Input valueLink={ this._linkState() }/>;
      } else if (type == 'checkedLink') {
        return <Input checkedLink={ this._linkState() }/>;
      } else if (type == 'checked') {
        return <Input checked={ this.state.value } onChange={ this._onChange }/>;
      }

      return <Input value={ this.state.value } onChange={ this._onChange }/>;
    },

    _onChange : function(e) {
      var val = type == 'checked' ? e.target.checked : e.target.value;
      this.setState({ value : val });
    },

    _linkState : function() {
      var self = this;

      return {
        value: this.state.value,
        requestChange: function(newValue) {
          self.setState({ value : newValue });
        }
      };
    }
  });
}

//
// Test Components
//

const TextInput = React.createClass({
  mixins : [LinkedStateAdapter],
  render : function() {
    return <input type="text" value={ this.value() } onChange={ this.onChange() }/>;
  }
});

const CheckboxInput = React.createClass({
  mixins : [LinkedStateAdapter],
  render : function() {
    return <input type="checkbox" checked={ this.checked() } onChange={ this.onChange() }/>;
  }
});
