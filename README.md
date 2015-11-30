appium-safar-driver
===================

Work in progress, stay tuned!
A better abstraction for connecting to the Safari Inspector on ios simulators

For developers on the repo:
driver-e2e-specs.js requires that a simulator is already running, and is running safari.
It didn't make much sense to add the simulator start/stop functionality to this driver since it's not quite a standalone driver but more for proxying to from other running drivers.

## Watch

```
npm run watch
```

## Test

```
npm test
```
