# LinkedStateAdapter

This package provides mixins and functions that will help React applications to continue the use of `ReactLink` after it is deprecated/removed. As of React v15, `ReactLink` is being deprecated. That means the `LinkedStateMixin` mixin, and the `valueLink` and `checkedLink` props on `<input>` element will be removed in future releases of React.

There are a few reasons you may want to use this package:
- you are upgrading an existing React application to React 15 or above
- you like the simplicity the original `ReactLink` and `LinkedStateMixin` provide
- you want your input component to support two-way binding in the `ReactLink` way and the `value`/`onChange` handler way at the same time

## Getting Started

### Installation
Install the `linked-state-adapter` npm package:

```sh
npm install --save linked-state-adapter
```

### Basic Examples

#### Adapting valueLink
```js
const LinkedStateAdapter = require('linked-state-adapter');
const TextInput = React.createClass({
  mixins : [LinkedStateAdapter],
  render : function() {
    return <input type="text" value={ this.value() } onChange={ this.onChange() }/>;
  }
});

// creates the TextInput element using valueLink and
// ReactLink from react-addons-linked-state-mixin
<TextInput valueLink={ this.linkState('value') }/>
// or you may use the 'value' and 'onChange' props instead
<TextInput value={ this.state.value } onChange={ this.changeHandler }/>
```

#### Adapting checkedLink
```js
const LinkedStateAdapter = require('linked-state-adapter');
const CheckboxInput = React.createClass({
  mixins : [LinkedStateAdapter],
  render : function() {
    return <input type="checkbox" checked={ this.checked() } onChange={ this.onChange() }/>;
  }
});

// creates the CheckboxInput element using checkedLink and
// ReactLink from react-addons-linked-state-mixin
<CheckboxInput checkedLink={ this.linkState('value') }/>
// or you may use the 'checked' and 'onChange' props instead
<CheckboxInput checked={ this.state.value } onChange={ this.changeHandler }/>
```


## License
MIT

