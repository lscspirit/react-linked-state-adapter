# react-linked-state-adapter [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

This package provides two mixins, `AdaptedLinkedStateMixin` and `ReactLinkAdapterMixin`, that will help React applications to continue the use of `ReactLink` after it is deprecated/removed.

As of React v15, `ReactLink` is being deprecated; the `LinkedStateMixin` mixin, and the `valueLink` and `checkedLink` props on `<input>` components will be removed in future releases of React. The recommended way to achieve two-way binding now is by explicitly setting the value and change handler of the input component (see the [Two-Way Binding Helpers](https://facebook.github.io/react/docs/two-way-binding-helpers.html) doc).

The two mixins here provides a few easy ways for you to convert all the `ReactLink` in your application into the `value`/`checked` and `onChange` props:

- `AdaptedLinkedStateMixin` - this mixin provides a `linkState()` and a `adaptReactLink()` functions. This allows you to enable two-way binding in a way that is very similar to the `LinkedStateMixin`

- `ReactLinkAdapterMixin` - this mixin allows a component (usually a higher-order component around an `<input>` element) to accept two-way binding props through both the `valueLink`/`checkedLink` fashion and the `value`/`checked` and `onChange` way

There are a few reasons you may want to use this package:
- you are upgrading an existing React application to React 15 or above but do not want to write additional change handlers for all your linked states
- you like the simplicity of the `ReactLink` and `LinkedStateMixin`
- you want your input component to support two-way binding in the `ReactLink` way and the `value`/`onChange` handler way at the same time

## Getting Started

### Installation
Install the `react-linked-state-adapter` npm package:

```sh
npm install --save react-linked-state-adapter
```

### Basic Usage

#### Using AdaptedLinkedStateMixin
```javascript
const { AdaptedLinkedStateMixin } = require('react-linked-state-adapter');
const InputForm = React.createClass({
    mixins : [AdaptedLinkedStateMixin],
    getInitialState : function() {
      return { input_txt : 'some text' };
    },
    render : function() {
      // NOTE: how the 'valueLink' prop is now split into the 'value' and 'onChange' props
      return <input type="text" value={ this.linkState('input_txt').value } onChange={ this.linkState('input_txt').onValueChange }/>
    }
});
```

#### Using ReactLinkAdapterMixin
```javascript
const { ReactLinkAdapterMixin } = require('react-linked-state-adapter');
const TextInput = React.createClass({
  mixins : [ReactLinkAdapterMixin],
  render : function() {
    return <input type="text" value={ this.value() } onChange={ this.onChange() }/>;
  }
});

// now you can use valueLink to create the TextInput
<TextInput valueLink={ this.linkState('value') }/>
// or you may use the 'value' and 'onChange' props instead
<TextInput value={ this.state.value } onChange={ this.someChangeHandler }/>
```

## AdaptedLinkedStateMixin

`AdaptedLinkedStateMixin` adds two functions to the component - `linkState()` and `adaptReactLink()`.

- **linkState(key)**

  This behaves exactly like the `linkState()` in `LinkedStateMixin`. It creates an object containing the value of the state (as indicated by the `key` parameter) and change handlers for updating that state.

  Example:
  ```javascript
  <input type="text" value={ this.linkState('input_txt').value } onChange={ this.linkState('input_txt').onValueChange }/>
  ```
- **adaptReactLink(link)**

  This converts a `ReactLink` from the `LinkedStateMixin` into a link that can be used with the `value`/`checked` and `onChange` props.

  Example:
  ```javascript
  const SomeInput = React.createClass({
    mixins : [AdaptedLinkedStateMixin],
    render : function() {
      var adaptedLink = this.adaptReactLink(this.props.someValueLink);
      return <input type="text" value={ adaptedLink.value } onChange={ adaptedLink.onValueChange }/>;
    }
  });
  ```

### Using Checkbox and Radio Button

When using the linked state with checkbox and radio input element, be sure to:
- set the `checked` prop instead of the `value` prop
- use the linked state's `onCheckedChange` handler instead of the `onValueChange` handler

Example:
```javascript
<input type="checkbox" checked={ this.linkState("checked").value } onChange={ this.linkState("checked").onCheckedChange }/>
```


## ReactLinkAdapterMixin

Component using this mixin can accept either a `valueLink`/`checkedLink` prop **OR** a combination of `value`/`checked` and `onChange` props. The mixin adds three functions to the component:

- **value()**

  Returns the value provided through either the `value` prop or the `valueLink` prop. Use this function to pass the linked value to the `<input>` element (except for `checkbox` and `radio`)

  ```javascript
  <input type="text" value={ this.value() }/>
  ```

- **checked()**

  Returns the checked value provided through either the `checked` prop or the `checkedLink` prop. Only use this function to pass the checked flag to `<input>` element of type `checkbox` and `radio`

  ```javascript
  <input type="checkbox" checked={ this.checked() }/>;
  ```

- **onChange()**

  Returns the `onChange` change handler. Use this function to pass the change handler to the `<input>` element.
  This function automatically determined whether to return a handler for value change or checked change based on the `props` provided

  ```javascript
  <input type="text" onChange={ this.onChange() }/>;
  ```


## Migrating from `ReactLink` and `LinkedStateMixin`

### Example 1

Below shows how you can migrate from using the `LinkedStateMixin` to `AdaptedLinkedStateMixin` in a component that directly consumes the linked state.

**Before:**
```javascript
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const TextInput = React.createClass({
  mixins : [LinkedStateMixin],
  render : function() {
    return <input type="text" valueLink={ this.linkState('txt_input') }/>;
  }
});
```

**After:**
```javascript
const { AdaptedLinkedStateMixin } = require('react-linked-state-adapter');
const TextInput = React.createClass({
  mixins : [AdaptedLinkedStateMixin],
  render : function() {
    return <input type="text" value={ this.linkState('txt_input').value } onChange={ this.linkState('txt_input').onValueChange }/>;
  }
});
```

### Example 2

Below shows how you only need to migrate the lower level input component while leaving your higher level component unchanged.

**Before:**
```javascript
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const StyledTextInput = React.createClass({
  render : function() {
    return (
      <div>
        <input type="text" valueLink={ this.props.valueLink }/>
      </div>
    );
  }
});

const InputForm = React.createClass({
  mixins : [LinkedStateMixin],
  render : function() {
    return <StyledTextInput valueLink={ this.linkState('txt_input') }/>
  }
});
```

**After:**
```javascript
const { ReactLinkAdapterMixin } = require('react-addons-linked-state-mixin');
// NOTE: keeping the name LinkedStateMixin here so that the InputForm component can remain the same
const LinkedStateMixin = require('react-addons-linked-state-mixin').AdaptedLinkedStateMixin;
const StyledTextInput = React.createClass({
  mixins : [ReactLinkAdapterMixin],
  render : function() {
    return (
      <div>
        <input type="text" value={ this.value() } onChange={ this.onChange() }/>
      </div>
    );
  }
});

const InputForm = React.createClass({
  mixins : [LinkedStateMixin],
  render : function() {
    return <StyledTextInput valueLink={ this.linkState('txt_input') }/>
  }
});
```

## Issues

Use [Github issues](https://github.com/lscspirit/react-linked-state-adapter/issues) for bugs and requests.

## Changelog

Changes are tracked as [Github releases](https://github.com/lscspirit/react-linked-state-adapter/releases).

## License
MIT

[build]: https://travis-ci.org/lscspirit/react-linked-state-adapter
[build-badge]: https://travis-ci.org/lscspirit/react-linked-state-adapter.svg?branch=master

[npm]: https://www.npmjs.com/package/react-linked-state-adapter
[npm-badge]: https://badge.fury.io/js/react-linked-state-adapter.svg
