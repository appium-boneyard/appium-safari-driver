import { BaseDriver } from 'appium-base-driver';
import log from './logger';

class SafariDriver extends BaseDriver {
  constructor (opts = {}, shouldValidateCaps = true) {
    super(opts, shouldValidateCaps);

    // TODO set up desired cap constraints
    //this.desiredCapConstraints = desiredCapConstraints;
    this.wda = null;
    this.jwpProxyActive = false;
    this.proxyReqRes = null;
    this.jwpProxyAvoid = [];
  }

  get driverData () {
    // TODO fill out resource info here
    return {};
  }

  async createSession (caps) {
    log.info('creating session');
      // TODO add validation on caps
      // TODO handle otherSessionData for multiple sessions
      let sessionId;
      [sessionId] = await super.createSession(caps);

  }

  async deleteSession () {
    this.jwpProxyActive = false;
    this.proxyReqRes = null;
    // TODO kill the future WDA subproc
    await super.deleteSession();
  }


}

export { SafariDriver };
