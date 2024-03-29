# Deprecated

This component is deprecated. Use `@advanced-rest-client/app` instead.

----

The UI and logic related to environment and variables management in Advanced REST Client.

## Installation

```bash
npm i @advanced-rest-client/arc-environment
```

## Usage

The `variables-overlay` renders an overlay with a list of variables in the current environment. The `environment-selector` renders an UI to select an environment. The `variables-list` renders a basic list of variables.

All of these elements are powered by `@advanced-rest-client/arc-models` which acts as a context store for the environments and variables.

The `VariablesProcessor` is a class that processes input to look for variables and replaces them in the input. This is used in ARC to process the request data.

The `VariablesConsumerMixin` can be used to extend a ListElement base to provide the element with functions and variables related to environments and variables.

## Development

```sh
git clone https://github.com/advanced-rest-client/arc-actions
cd arc-actions
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
