"use strict";

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import faker from 'faker';

import ReactLinkAdapterMixin from '../src/react-link-adapter-mixin';
import MockState from './helpers/mock-state';

//
// Specs
//

describe('ReactLinkAdapterMixin', function() {
  var mockComponentState = null;

  //
  // Setup
  //
  beforeEach(function() {
    mockComponentState = new MockState();
  });

  //
  // Text Input
  //
  context('in a higher order text input component', function() {
    //
    // Value Link
    //
    context('using valueLink', function() {
      it('sets the input value to the "value" state', function() {
        mockComponentState.setState({ value: faker.lorem.sentence() });

        // link the state to the TextInput via valueLink
        const wrapper = mount(<TextInput valueLink={ mockComponentState.linkState('value') }/>);
        expect(wrapper.find('input').prop('value')).to.eq(mockComponentState.get('value'));
      });

      it('updates the "value" state when input changes', function() {
        const txtVal = faker.lorem.sentence();

        // link the state to the TextInput via valueLink
        const wrapper = mount(<TextInput valueLink={ mockComponentState.linkState('value') }/>);
        // change the text input
        wrapper.find('input').simulate('change', { target: { value: txtVal } });
        expect(mockComponentState.get('value')).to.eq(txtVal);
      });

      it('updates the input value when valueLink changes', function() {
        mockComponentState.setState({
          oldValue: faker.lorem.sentence(),
          newValue: faker.lorem.sentence()
        });

        const wrapper = mount(<TextInput valueLink={ mockComponentState.linkState('oldValue') }/>);
        // changes the valueLink prop
        wrapper.setProps({ valueLink: mockComponentState.linkState('newValue') });
        expect(wrapper.find('input').prop('value')).to.eq(mockComponentState.get('newValue'));
      });

      it('updates the change handler when valueLink changes', function() {
        const oldTxt = faker.lorem.sentence();
        const newTxt = faker.lorem.sentence();

        const wrapper = mount(<TextInput valueLink={ mockComponentState.linkState('oldValue') }/>);
        wrapper.find('input').simulate('change', { target: { value: oldTxt } });
        // changes the valueLink prop
        wrapper.setProps({ valueLink: mockComponentState.linkState('newValue') });
        wrapper.find('input').simulate('change', { target: { value: newTxt } });

        expect(mockComponentState.get('oldValue')).to.eq(oldTxt);
        expect(mockComponentState.get('newValue')).to.eq(newTxt);
      });
    });

    //
    // Value and onChange
    //
    context('using "value" and "onChange" props', function() {
      var changeHandler = function(key) {
        return function(e) {
          var state = {};
          state[key] = e.target.value;
          mockComponentState.setState(state);
        };
      };

      it('sets the input value to the "value" state', function() {
        mockComponentState.setState({ value: faker.lorem.sentence() });

        // set the 'value' and 'onChange' of the TextInput
        const wrapper = mount(<TextInput value={ mockComponentState.get('value') } onChange={ changeHandler('value') }/>);
        expect(wrapper.find('input').prop('value')).to.eq(mockComponentState.get('value'));
      });

      it('updates the "value" state when input changes', function() {
        const txtVal = faker.lorem.sentence();

        // set the 'value' and 'onChange' of the TextInput
        const wrapper = mount(<TextInput value={ mockComponentState.get('value') } onChange={ changeHandler('value') }/>);
        // change the text input
        wrapper.find('input').simulate('change', { target: { value: txtVal } });
        expect(mockComponentState.get('value')).to.eq(txtVal);
      });

      it('updates the input value when "value" prop changes', function() {
        const newTxt = faker.lorem.sentence();

        const wrapper = mount(<TextInput value={ faker.lorem.sentence() }/>);
        wrapper.setProps({ value: newTxt });
        expect(wrapper.find('input').prop('value')).to.eq(newTxt);
      });

      it('updates the change handler when "onChange" prop changes', function() {
        const oldTxt = faker.lorem.sentence();
        const newTxt = faker.lorem.sentence();

        const wrapper = mount(<TextInput onChange={ changeHandler('oldValue') }/>);
        wrapper.find('input').simulate('change', { target: { value: oldTxt } });
        // change the "onChange" prop
        wrapper.setProps({ onChange: changeHandler('newValue') });
        wrapper.find('input').simulate('change', { target: { value: newTxt } });

        expect(mockComponentState.get('oldValue')).to.eq(oldTxt);
        expect(mockComponentState.get('newValue')).to.eq(newTxt);
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
      it('sets the checked property according to the "value" state', function() {
        mockComponentState.setState({ checked: faker.random.boolean() });

        // link the state to the CheckboxInput via checkedLink
        const wrapper = mount(<CheckboxInput checkedLink={ mockComponentState.linkState('checked') }/>);
        expect(wrapper.find('input').prop('checked')).to.eq(mockComponentState.get('checked'));
      });

      it('updates the "value" state when toggled', function() {
        const isChecked = faker.random.boolean();
        mockComponentState.setState({ checked: isChecked });

        // link the state to the CheckboxInput via checkedLink
        const wrapper = mount(<CheckboxInput checkedLink={ mockComponentState.linkState('checked') }/>);
        // flip the checked state
        wrapper.find('input').simulate('change', { target: { checked: !!isChecked } });
        expect(mockComponentState.get('checked')).to.eq(!!isChecked);
      });

      it('updates the input value when valueLink changes', function() {
        const isOldChecked = faker.random.boolean();
        mockComponentState.setState({
          oldChecked: isOldChecked,
          newChecked: !isOldChecked
        });

        const wrapper = mount(<CheckboxInput checkedLink={ mockComponentState.linkState('oldChecked') }/>);
        // changes the checkedLink prop
        wrapper.setProps({ checkedLink: mockComponentState.linkState('newChecked') });
        expect(wrapper.find('input').prop('checked')).to.eq(mockComponentState.get('newChecked'));
      });

      it('updates the change handler when checkedLink changes', function() {
        const oldChecked = faker.random.boolean();
        const newChecked = !oldChecked;

        const wrapper = mount(<CheckboxInput checkedLink={ mockComponentState.linkState('oldChecked') }/>);
        wrapper.find('input').simulate('change', { target: { checked: oldChecked } });
        // changes the valueLink prop
        wrapper.setProps({ checkedLink: mockComponentState.linkState('newChecked') });
        wrapper.find('input').simulate('change', { target: { checked: newChecked } });

        expect(mockComponentState.get('oldChecked')).to.eq(oldChecked);
        expect(mockComponentState.get('newChecked')).to.eq(newChecked);
      });
    });

    //
    // Checked and onChange
    //
    context('using "checked" and "onChange" props', function() {
      var changeHandler = function(key) {
        return function(e) {
          var state = {};
          state[key] = e.target.checked;
          mockComponentState.setState(state);
        };
      };

      it('sets the checked property according to the "value" state', function() {
        mockComponentState.setState({ checked: faker.random.boolean() });

        // set the 'checked' and 'onChange' prop of CheckboxInput
        const wrapper = mount(<CheckboxInput checked={ mockComponentState.get('checked') } onChange={ changeHandler('checked') }/>);
        expect(wrapper.find('input').prop('checked')).to.eq(mockComponentState.get('checked'));
      });

      it('updates the "value" state when toggled', function() {
        const isChecked = faker.random.boolean();
        mockComponentState.setState({ checked: isChecked });

        // set the 'checked' and 'onChange' prop of CheckboxInput
        const wrapper = mount(<CheckboxInput checked={ mockComponentState.get('checked') } onChange={ changeHandler('checked') }/>);
        // flip the checked state
        wrapper.find('input').simulate('change', { target: { checked: !!isChecked } });
        expect(mockComponentState.get('checked')).to.eq(!!isChecked);
      });

      it('updates the input value when "checked" prop changes', function() {
        const isOldChecked = faker.random.boolean();
        const wrapper = mount(<CheckboxInput checked={ isOldChecked }/>);
        // changes the checkedLink prop
        wrapper.setProps({ checked: !isOldChecked });
        expect(wrapper.find('input').prop('checked')).to.eq(!isOldChecked);
      });

      it('updates the change handler when checkedLink changes', function() {
        const oldChecked = faker.random.boolean();
        const newChecked = !oldChecked;

        const wrapper = mount(<CheckboxInput onChange={ changeHandler('oldChecked') }/>);
        wrapper.find('input').simulate('change', { target: { checked: oldChecked } });
        // changes the valueLink prop
        wrapper.setProps({ onChange: changeHandler('newChecked') });
        wrapper.find('input').simulate('change', { target: { checked: newChecked } });

        expect(mockComponentState.get('oldChecked')).to.eq(oldChecked);
        expect(mockComponentState.get('newChecked')).to.eq(newChecked);
      });
    });
  });
});

//
// Test Components
//

const TextInput = React.createClass({
  mixins : [ReactLinkAdapterMixin],
  render : function() {
    return <input type="text" value={ this.value() } onChange={ this.onChange() }/>;
  }
});

const CheckboxInput = React.createClass({
  mixins : [ReactLinkAdapterMixin],
  render : function() {
    return <input type="checkbox" checked={ this.checked() } onChange={ this.onChange() }/>;
  }
});
