import { BaseDriver } from 'appium-base-driver';
import log from './logger';
import _ from 'lodash';
import commands from './commands/index';
// import { RemoteDebugger } from 'appium-remote-debugger';

class SafariDriver extends BaseDriver {
  constructor (opts = {}, shouldValidateCaps = true) {
    super(opts, shouldValidateCaps);

    // TODO set up desired cap constraints
    //this.desiredCapConstraints = desiredCapConstraints;

  }

  get driverData () {
    // TODO fill out resource info here
    return {};
  }

  // we need bundleId and platformVersion
  async createSession (caps) {
    log.info('creating session');
    // TODO add validation on caps
    // TODO handle otherSessionData for multiple sessions
    let sessionId;
    [sessionId] = await super.createSession(caps);

    // this.remote = new RemoteDebugger({
    //   bundleId: this.opts.bundleId,
    //   platformVersion: this.opts.platformVerion
    // });

    this.remote = null;

  }

  async deleteSession () {
    this.jwpProxyActive = false;
    this.proxyReqRes = null;
    // TODO kill the future WDA subproc
    await super.deleteSession();
  }

  // TODO replace this stub
  isWebContext () {
    return true;
  }

  // TODO replace this stub
  isRealDevice () {
    return false;
  }


}

for (let [cmd, fn] of _.pairs(commands)) {
  SafariDriver.prototype[cmd] = fn;
}

export { SafariDriver };
