appium-safari-driver
===================

Work in progress, stay tuned!
A better abstraction for connecting to the Safari Inspector on ios simulators

For developers on the repo:
It didn't make much sense to add the simulator start/stop functionality to this driver since it's not quite a standalone driver but more for proxying to from other running drivers.

## Watch / Transpile / Unit tests

```
gulp
```

## Test

To get logs for the commands below, set the environment variable `_FORCE_LOGS=1`

Unit tests:

```
gulp once

_FORCE_LOGS=1 gulp once
```

Functional tests:

```
gulp e2e-test

_FORCE_LOGS=1 gulp e2e-test
```
