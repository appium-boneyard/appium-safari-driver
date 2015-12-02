import { BaseDriver } from 'appium-base-driver';
import log from './logger';
import _ from 'lodash';
import { retryInterval } from 'asyncbox';
import commands from './commands/index';
import { RemoteDebugger } from 'appium-remote-debugger';

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

    this.remote = new RemoteDebugger({
      bundleId: this.opts.bundleId,
      platformVersion: this.opts.platformVersion
    });

    log.info('creating connection to remote debugger');
    await this.remote.connect();
    let pages = await retryInterval(100, 200, async () => {
      let pages = await this.remote.selectApp();
      if (!pages.length) {
        throw new Error('no app connected');
      }
      return pages;
    });
    if (!pages.length) {
      throw new Error('Could not find Safari or an app with webviews running');
    }
    await this.remote.selectPage(pages[0].id);
    log.info('remote debugger connected');

  }

  async deleteSession () {
    if (this.remote) {
      await this.remote.disconnect();
    }
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
