# CreditCardNumberInput

`CreditCardNumberInput` is a React component that wraps an input field that contains a credit card number and displays the corresponding credit card logo inside this field, on the far right.

## Usage

```jsx
import CreditCardNumberInput from 'calypso/components/upgrades/credit-card-number-input';

function MyComponent() {
	return <CreditCardNumberInput value={ this.state.card.number } />;
}
```

## Properties

This component don't require any property but will pass any one assigned to the wrapped input field component.
