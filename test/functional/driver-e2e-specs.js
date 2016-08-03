/* eslint no-console:0 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getDevices } from 'node-simctl';
import { getSimulator } from 'appium-ios-simulator';
import { SafariDriver } from '../../lib/driver.js';

chai.should();
chai.use(chaiAsPromised);

const PLATFORM_VERSION = '9.3';
const DEFAULT_CAPS = {
  platformName: 'iOS',
  platformVersion: PLATFORM_VERSION,
  bundleId: "com.apple.mobilesafari",
  deviceName: "iPhone 6",
  safariInitialUrl: 'http://appium.io/'
};


describe('SafariDriver', function () {
  this.timeout(200000);

  let driver, sim;
  before(async () => {
    // await killAllSimulators();
    let devices = await getDevices();
    if (!devices[PLATFORM_VERSION] || devices[PLATFORM_VERSION].length === 0) {
      throw new Error(`Could not find a ${PLATFORM_VERSION} sim`);
    }
    sim = await getSimulator(devices[PLATFORM_VERSION][0].udid);
    await sim.run();
    // await sim.run(); // travis is having a hard time
    await sim.openUrl("http://appium.io");
    driver = new SafariDriver();
    await driver.createSession(DEFAULT_CAPS);

    console.log('\n\nWE HAVE GOTTEN THROUGH SESSION CREATION');
  });

  afterEach(() => {
    // make  the tests more readable by separating.
    console.log('\n\n\n\n\n\nNEXT TEST...');
  });

  after(async () => {
    await driver.deleteSession();
    // await killAllSimulators();
  });

  it('gets contexts', async function () { // eslint-disable-line mocha/no-exclusive-tests
    let contexts = await driver.getContexts();
    contexts.length.should.be.at.least(2);

    contexts = await driver.getContexts();
    contexts.length.should.be.at.least(2);
  });

  it('gets source of first webview', async function () {
    let source = await driver.getPageSource();
    source.should.include('Appium: Mobile App Automation Made Awesome');
  });

  it.skip('gets title of first webview', async function () {
    await driver.setUrl('http://www.appium.io');
    console.log('done with setting the url');
    let title = await driver.title();

    title.should.equal('Appium: Mobile App Automation Made Awesome.');
  });

  it.skip('finds elements by class name', async function () {
    await driver.setUrl('http://www.appium.io');
    let heading = await driver.findElOrEls('class name', 'jumbotron', false);
    let text = await driver.getText(heading);
    text.should.contain('Appium');
  });


  it.skip('finds elements by css', async function () {
    await driver.setUrl('http://www.appium.io');
    let navBarLinks = await driver.findElOrEls('css', '.navbar-nav-center a', true);
    navBarLinks.length.should.equal(5);
  });


});
