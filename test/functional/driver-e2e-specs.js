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
    this.timeout(10 * 1000);

    let driver = new SafariDriver();
    await driver.createSession(DEFAULT_CAPS);

    let contexts = await driver.getContexts();

    console.log(contexts);
    contexts.length.should.be.above(0);

    contexts = await driver.getContexts();
    contexts.length.should.be.above(0);
  });

});
