import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SafariDriver } from '../../lib/driver.js';

chai.should();
chai.use(chaiAsPromised);

const DEFAULT_CAPS = {
  platformName: 'iOS',
  platformVersion: '9.1',
  bundleId: "com.apple.mobilesafari",
  deviceName: "iPhone 6"
};

describe('SafariDriver', () => {

  it('gets contexts', async function () {

    let driver = new SafariDriver();
    await driver.createSession(DEFAULT_CAPS);

    let contexts = await driver.getContexts();

    contexts.length.should.be.above(0);

    contexts = await driver.getContexts();
    contexts.length.should.be.above(0);

    await driver.deleteSession();
  });

  it.only('gets source of first webview', async function () {
    this.timeout(20*1000);
    let driver = new SafariDriver();
    await driver.createSession(DEFAULT_CAPS);

    let source = await driver.getPageSource();

    source.length.should.be.above(0);

    await driver.deleteSession();
  });

  it('gets title of first webview', async function () {
    let driver = new SafariDriver();
    await driver.createSession(DEFAULT_CAPS);

    await driver.getUrl('http://www.appium.io');
    let title = await driver.title();

    title.should.equal('Appium: Mobile App Automation Made Awesome.');

    await driver.deleteSession();
  });

});
