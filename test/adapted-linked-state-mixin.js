"use strict";

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import faker from 'faker';

import AdaptedLinkedStateMixin from '../src/adapted-linked-state-mixin';
import MockState from './helpers/mock-state';

//
// Specs
//

describe("AdaptedLinkedStateMixin", function() {
  context("#linkState()", function() {
    it("creates a link with the value of the state", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      wrapper.setState({ value: faker.lorem.sentence() });

      const link = wrapper.instance().linkState('val');
      expect(link.value).to.eq(wrapper.state('val'));
    });

    it("creates a link with a requestChange function", function() {
      const txtVal = faker.lorem.sentence();
      const wrapper = shallow(<ComponentWithMixin/>);

      const link = wrapper.instance().linkState('val');
      link.requestChange(txtVal);
      expect(wrapper.state('val')).to.eq(txtVal);
    });

    it("creates a link with a onValueChange function", function() {
      const txtVal = faker.lorem.sentence();
      const wrapper = shallow(<ComponentWithMixin/>);

      const link = wrapper.instance().linkState('val');
      link.onValueChange({ target: { value: txtVal } });
      expect(wrapper.state('val')).to.eq(txtVal);
    });

    it("creates a link with a onCheckedChange function", function() {
      const isChecked = faker.random.boolean();
      const wrapper = shallow(<ComponentWithMixin/>);

      const link = wrapper.instance().linkState('val');
      link.onCheckedChange({ target: { checked: isChecked } });
      expect(wrapper.state('val')).to.eq(isChecked);
    });

    it("returns a different link for different state", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      wrapper.setState({ val_1: faker.lorem.sentence(), val_2: faker.lorem.sentence() });
      const link_1 = wrapper.instance().linkState('val_1');
      const link_2 = wrapper.instance().linkState('val_2');

      expect(link_1).to.not.eq(link_2);
      expect(link_1.value).to.not.eq(link_2.value);
      expect(link_1.requestChange).to.not.eq(link_2.requestChange);
      expect(link_1.onValueChange).to.not.eq(link_2.onValueChange);
      expect(link_1.onCheckedChange).to.not.eq(link_2.onCheckedChange);
    });

    it("reuses a cached link if the state value did not change", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      wrapper.setState({ val: faker.lorem.sentence() });

      const link_1 = wrapper.instance().linkState('val');
      const link_2 = wrapper.instance().linkState('val');

      expect(link_1).to.eq(link_2);
    });

    it("creates a new link if the state value changed (but re-uses the change handlers)", function() {
      const wrapper = shallow(<ComponentWithMixin/>);

      wrapper.setState({ val: faker.lorem.sentence() });
      const link_1 = wrapper.instance().linkState('val');

      wrapper.setState({ val: faker.lorem.sentence() });
      const link_2 = wrapper.instance().linkState('val');

      // the link object should be different
      expect(link_1).to.not.eq(link_2);
      expect(link_1.value).to.not.eq(link_2.value);
      // but the change handlers should be the same
      expect(link_1.requestChange).to.eq(link_2.requestChange);
      expect(link_1.onValueChange).to.eq(link_2.onValueChange);
      expect(link_1.onCheckedChange).to.eq(link_2.onCheckedChange);
    });
  });

  context("#adaptReactLink()", function() {
    var mockComponentState = null;

    beforeEach(function() {
      mockComponentState = new MockState({ val: faker.lorem.sentence() });
    });

    it("converts the link into a AdaptedReactLink with the value of the original link", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      const link = mockComponentState.linkState('val');

      const adapted = wrapper.instance().adaptReactLink(link);
      expect(adapted.value).to.eq(link.value);
    });

    it("converts the link into a AdaptedReactLink with the requestChange function of the original link", function() {
      const txtVal = faker.lorem.sentence();
      const wrapper = shallow(<ComponentWithMixin/>);
      const link = mockComponentState.linkState('val');

      const adapted = wrapper.instance().adaptReactLink(link);
      adapted.requestChange(txtVal);
      expect(mockComponentState.get('val')).to.eq(txtVal);
    });

    it("converts the link into a AdaptedReactLink with a onValueChange function", function() {
      const txtVal = faker.lorem.sentence();
      const wrapper = shallow(<ComponentWithMixin/>);
      const link = mockComponentState.linkState('val');

      const adapted = wrapper.instance().adaptReactLink(link);
      adapted.onValueChange({ target: { value: txtVal } });
      expect(mockComponentState.get('val')).to.eq(txtVal);
    });

    it("converts the link into a AdaptedReactLink with a onCheckedChange function", function() {
      const isChecked = faker.random.boolean();
      const wrapper = shallow(<ComponentWithMixin/>);
      const link = mockComponentState.linkState('val');

      const adapted = wrapper.instance().adaptReactLink(link);
      adapted.onCheckedChange({ target: { checked: isChecked } });
      expect(mockComponentState.get('val')).to.eq(isChecked);
    });

    it("returns a different AdaptedReactLink for different ReactLink", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      mockComponentState.setState({ val_1: faker.lorem.sentence(), val_2: faker.lorem.sentence() });
      const link_1 = mockComponentState.linkState('val_1');
      const link_2 = mockComponentState.linkState('val_2');

      const adapted_1 = wrapper.instance().adaptReactLink(link_1);
      const adapted_2 = wrapper.instance().adaptReactLink(link_2);

      expect(adapted_1).to.not.eq(adapted_2);
      expect(adapted_1.value).to.not.eq(adapted_2.value);
      expect(adapted_1.requestChange).to.not.eq(adapted_2.requestChange);
      expect(adapted_1.onValueChange).to.not.eq(adapted_2.onValueChange);
      expect(adapted_1.onCheckedChange).to.not.eq(adapted_2.onCheckedChange);
    });

    it("returns the link as-is if the input is a AdaptedReactLink already", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      const link = wrapper.instance().linkState('val');

      const adapted = wrapper.instance().adaptReactLink(link);
      expect(adapted).to.eq(link);
    });

    it("returns a cached AdaptedReactLink if the link value did not change", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      const link = mockComponentState.linkState('val');

      const adapted_1 = wrapper.instance().adaptReactLink(link);
      const adapted_2 = wrapper.instance().adaptReactLink(link);

      expect(adapted_2).to.eq(adapted_1);
    });

    it("returns a new AdaptedReactLink if only the link value changed, but re-use the change handlers", function() {
      const wrapper = shallow(<ComponentWithMixin/>);
      const link_1 = mockComponentState.linkState('val');
      mockComponentState.setState({ val: faker.lorem.sentence() });
      const link_2 = mockComponentState.linkState('val');

      const adapted_1 = wrapper.instance().adaptReactLink(link_1);
      const adapted_2 = wrapper.instance().adaptReactLink(link_2);

      // the link object should be different
      expect(adapted_2).to.not.eq(adapted_1);
      expect(adapted_2.value).to.not.eq(adapted_1.value);
      // but the change handlers should be the same
      expect(adapted_2.requestChange).to.eq(adapted_1.requestChange);
      expect(adapted_2.onValueChange).to.eq(adapted_1.onValueChange);
      expect(adapted_2.onCheckedChange).to.eq(adapted_1.onCheckedChange);
    });
  });
});

//
// Test Component
//

const ComponentWithMixin = React.createClass({
  mixins : [AdaptedLinkedStateMixin],
  getInitialState : function() {
    return {};
  },
  render : function() {
    return <div/>;
  }
});