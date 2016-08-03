import { BaseDriver } from 'appium-base-driver';
import log from './logger';
import _ from 'lodash';
import commands from './commands/index';


class SafariDriver extends BaseDriver {
  constructor (opts = {}, shouldValidateCaps = true, webview = false) {
    super(opts, shouldValidateCaps);

    this.webview = !!webview;

    // TODO set up desired cap constraints
    //this.desiredCapConstraints = desiredCapConstraints;

    this.webElementIds = [];
    this.curWebFrames = [];
    this.selectingNewPage = false;
    this.windowHandleCache = [];

    this.locatorStrategies = [
      'xpath',
      'id',
      'class name',
      'link text',
      'css selector',
      'tag name',
      'partial link text'
    ];
  }

  get driverData () {
    // TODO fill out resource info here
    return {};
  }

  // we need bundleId and platformVersion
  async createSession (caps) {
    log.info('Creating session');
    // TODO add validation on caps
    // TODO handle otherSessionData for multiple sessions
    let sessionId;
    [sessionId] = await super.createSession(caps);

    if (!this.webview) {
      this.setCurrentUrl(this.caps.safariInitialUrl || `http://127.0.0.1:${this.opts.port}/welcome`);
      log.debug('Waiting for initial webview');
      await this.navToInitialWebview();
    }

    log.info('Safari session ready to receive commands');

    return sessionId;
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

for (let [cmd, fn] of _.toPairs(commands)) {
  SafariDriver.prototype[cmd] = fn;
}

export { SafariDriver };
