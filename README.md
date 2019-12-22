# WIP oc-template-typescript-react

react-templates with typescript support & utilties for the [OpenComponents](https://github.com/opentable/oc) template system

Based on Nick Balestra's work on [oc-template-react](https://github.com/opencomponents/oc-template-react)

---

## Packages included in this repo

| Name                                                                                       | Version                                                                                                                                             |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`oc-template-typescript-react`](/packages/oc-template-typescript-react)                   | [![npm version](https://badge.fury.io/js/oc-template-typescript-react.svg)](http://badge.fury.io/js/oc-template-typescript-react)                   |
| [`oc-template-typescript-react-compiler`](/packages/oc-template-typescript-react-compiler) | [![npm version](https://badge.fury.io/js/oc-template-typescript-react-compiler.svg)](http://badge.fury.io/js/oc-template-typescript-react-compiler) |

## Usage:

Initialize a component with the oc-template-react and follow the CLI instructions

```
$ oc init <your-component-name> oc-template-typescript-react
$ cd <your-component-name>
$ npm install
```

## Extra info:

### package.json requirements

- `template.src` - the react App entry point - should export a react component as `default`
- `template.type` - `oc-template-typescript-react`
- required in `devDependencies` - `oc-template-react-compiler`, `react`, `react-dom`, `@types/react`

### conventions

- `props = server()` - the viewModel generated by the server is automatically passed to the react application as props
- The oc-client-browser is extended and will now expose all the available react-component at `oc.reactComponents[bundleHash]`
- You can register an event handler within the [oc.events](https://github.com/opentable/oc/wiki/Browser-client#oceventsoneventname-callback) system for the the `oc:componentDidMount` event. The event will be fired immediately after the react app is mounted.
- You can register an event handler within the [oc.events](https://github.com/opentable/oc/wiki/Browser-client#oceventsoneventname-callback) system for the the `oc:cssDidMount` event. The event will be fired immediately after the style tag will be added to the active DOM tree.

### externals

Externals are not bundled when packaging and publishing the component, for better size taking advantage of externals caching. OC will make sure to provide them at Server-Side & Client-Side rendering time for you.

- React
- ReactDOM

### features

- `Server Side Rendering` = server side rendering should work as for any other OpenComponent
- `css-modules` are supported.
- `sass-modules` are supported (you need to install the `node-sass` dependency).
- `post-css` is supported with the following plugins:
  - [postcss-import](https://github.com/postcss/postcss-import)
  - [postcss-extend](https://github.com/travco/postcss-extend)
  - [postcss-icss-values](https://github.com/css-modules/postcss-icss-values)
  - [autoprefixer](https://github.com/postcss/autoprefixer)
- `White list dependencies` to be inlcuded in the build process done by the compiler. To whitelist dependencies installed in the node_modules folder, add in the package.json of the component a `buildIncludes` list:
  ```json
    ...
    oc : {
      files: {
        template: {
          ...
          buildIncludes: ['react-components-to-build']
        }
      }
    }
  ```

## Utils

The compiler exposes some utilities that could be used by your React application:

### HOCs

#### withDataProvider

An Higher order component that will make a `getData` function available via props.

##### Usage:

```javascript
import { withDataProvider } from "oc-template-typescript-react-compiler/utils";

const yourApp = props => {
  // you can use props.getData here
};

yourEnhancedApp = withDataProvider(yourApp);
```

`getData` accept two arguments: `(params, callback) => callback(err, result)`. It will perform a post back request to the component endpoint with the specified query perams invoking the callback with the results.

For more details, check the [`example app`](/acceptance-components/react-app/app.js)

#### withSettingProvider

An Higher order component that will make a `getSetting` function available via props.

##### Usage:

```javascript
import { withSettingProvider } from "oc-template-typescript-react-compiler/utils";

const yourApp = props => {
  // you can use props.getSetting here
};

yourEnhancedApp = withSettingProvider(yourApp);
```

`getSetting` accept one argument: `settingName => settingValue`. It will return the value for the requested setting.

Settings available at the moment:

- `getSetting('name')` : return the name of the OC component
- `getSetting('version')` : return the version of the OC component
- `getSetting('baseUrl')` : return the [baseUrl of the oc-registry](https://github.com/opentable/oc/wiki/The-server.js#context-properties)
- `getSetting('staticPath')` : return the path to the [static assets](https://github.com/opentable/oc/wiki/The-server.js#add-static-resource-to-the-component) of the OC component
