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

  let driver;
  before(async () => {
    driver = new SafariDriver();
    await driver.createSession(DEFAULT_CAPS);
  });

  after(async () => {
    await driver.deleteSession();
  });

  it('gets contexts', async function () {

    let contexts = await driver.getContexts();

    contexts.length.should.be.above(0);

    contexts = await driver.getContexts();
    contexts.length.should.be.above(0);
  });

  it('gets source of first webview', async function () {

    let source = await driver.getPageSource();

    source.length.should.be.above(0);
  });

  it('gets title of first webview', async function () {

    await driver.getUrl('http://www.appium.io');
    let title = await driver.title();

    title.should.equal('Appium: Mobile App Automation Made Awesome.');
  });

  it('finds elements by class name', async function () {

    await driver.getUrl('http://www.appium.io');
    let heading = await driver.findElOrEls('class name', 'jumbotron', false);
    let text = await driver.getText(heading);
    text.should.contain('Appium');
  });


  it('finds elements by css', async function () {

    await driver.getUrl('http://www.appium.io');
    let navBarLinks = await driver.findElOrEls('css', '.navbar-nav-center a', true);
    navBarLinks.length.should.equal(5);
  });


});
