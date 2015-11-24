import uuid from 'uuid-js';
import B from 'bluebird';
import path from 'path';
import { retry } from 'asyncbox';
import { fs } from 'appium-support';
import { utils } from 'appium-uiauto';
import logger from '../logger';
import { errors } from 'mobile-json-wire-protocol';


let commands = {}, helpers = {}, extensions = {};

commands.getScreenshot = async function () {
  let guid = uuid.create();
  let shotFile = `screenshot${guid}`;

  let shotFolder = path.resolve(this.opts.tmpDir, 'appium-instruments/Run 1/');
  if (!(await fs.exists(shotFolder))) {
    await fs.mkdirp(shotFolder);
  }

  let shotPath = path.resolve(shotFolder, `${shotFile}.png`);
  logger.debug(`Taking screenshot: '${shotPath}'`);

  let takeScreenShot = async () => {
    await this.uiAutoClient.sendCommand(`au.capture('${shotFile}')`);

    let screenshotWaitTimeout = (this.opts.screenshotWaitTimeout || 10) * 1000;
    logger.debug(`Waiting ${screenshotWaitTimeout} ms for screenshot to be generated.`);
    let startMs = Date.now();

    let success = false;
    while ((Date.now() - startMs) < screenshotWaitTimeout) {
      if (await fs.hasAccess(shotPath)) {
        success = true;
        break;
      }
      await B.delay(300);
    }
    if (!success) {
      throw new errors.UnknownError('Timed out waiting for screenshot file');
    }

    // check the rotation, and rotate if necessary
    if (await this.getOrientation() === 'LANDSCAPE') {
      logger.debug('Rotating landscape screenshot');
      await utils.rotateImage(shotPath, -90);
    }
    return await fs.readFile(shotPath);
  };

  // Retrying the whole screenshot process for three times.
  let data = await retry(3, takeScreenShot);
  return new Buffer(data).toString('base64');
};


Object.assign(extensions, commands, helpers);
export { commands, helpers };
export default extensions;
