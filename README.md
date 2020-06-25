# @xutl/modules

One [eXtremely Useful Tool Library](https://xutl.es) providing a simple preload module that allows replacing of depended modules with mock. Quite useful for testing.

## Install

```bash
npm install --save-dev @xutl/modules
```

## Usage

```bash
node -r @xutl/modules my-test.js
```

This will search along the path of the `my-test.js` file for a file called `modules.json`.
This must contain a plain json mapping between strings. The key will be a regular expression such that:

`actual = original.replace(new RegExp(<key>), <value>);`

The path of the `modules.json` file is also added in the first order to the search-paths.
