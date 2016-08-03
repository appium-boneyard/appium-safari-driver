import { fs, plist } from 'appium-support';
import logger from './logger';
import path from 'path';
import _ from 'lodash';
import { exec } from 'teen_process';


const rootDir = path.resolve(__dirname, '..', '..');


function appIsPackageOrBundle (app) {
  return (/^([a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+)+$/).test(app);
}

async function removeInstrumentsSocket (sock) {
  logger.debug("Removing any remaining instruments sockets");
  await fs.rimraf(sock);
  logger.debug("Cleaned up instruments socket " + sock);
}


function getSimForDeviceString (dString, availDevices) {
  let matchedDevice = null;
  let matchedUdid = null;
  _.each(availDevices, function (device) {
    if (device.indexOf(dString) !== -1) {
      matchedDevice = device;
      try {
        matchedUdid = /.+\[([^\]]+)\]/.exec(device)[1];
      } catch (e) {
        matchedUdid = null;
      }
    }
  });
  return [matchedDevice, matchedUdid];
}

async function detectUdid (caps) {
  if (caps.udid !== null && caps.udid === "auto") {
    logger.debug("Auto-detecting iOS udid...");
    let  cmd, args = [];
    try {
      cmd = await fs.which('idevice_id');
      args.push('-l');
    } catch (err) {
      cmd = require.resolve('udidetect');
    }
    let udid;
    try {
      let {stdout} = await exec(cmd, args, {timeout: 3000});
      udid = stdout.split("\n")[0];
    } catch (err) {
      logger.error("Error detecting udid");
      throw err;
    }
    if (udid && udid.length > 2) {
      caps.udid = udid;
      logger.debug("Detected udid as " + caps.udid);
    } else {
      throw new Error("Could not detect udid.");
    }
  } else {
    logger.debug("Not auto-detecting udid.");
  }
}

async function parseLocalizableStrings (opts) {
  if (_.isNull(opts.app) || _.isUndefined(opts.app)) {
    logger.debug("Localizable.strings is not currently supported when using real devices.");
    return;
  }
  let language = opts.language;
  let stringFile = "Localizable.strings";
  let strings = null;

  if (language) {
    strings = path.resolve(opts.app, language + ".lproj", stringFile);
  }
  if (!await fs.exists(strings)) {
    if (language) {
      logger.debug("No strings file '" + stringFile + "' for language '" + language + "', getting default strings");
    }
    strings = path.resolve(opts.app, stringFile);
  }
  if (!await fs.exists(strings)) {
    strings = path.resolve(opts.app, opts.localizableStringsDir, stringFile);
  }
  if (!await fs.exists(strings)) {
    logger.warn('Could not file localizable strings file: Localizable.strings!');
    return;
  }

  let obj;
  try {
    obj = await plist.parsePlistFile(strings);
    logger.debug("Parsed app " + stringFile);
    opts.localizableStrings = obj;
  } catch (err) {
    logger.warn("Could not parse app " + stringFile +" assuming it " +
                "doesn't exist");
  }
}

function shouldPrelaunchSimulator (caps, iosSdkVersion) {
  let shouldPrelaunch = false;

  if (caps.defaultDevice || iosSdkVersion >= 7.1) {
    if (this.iosSdkVersion >= 7.1) {
      logger.debug("We're on iOS7.1+ so forcing defaultDevice on");
    } else {
      logger.debug("User specified default device, letting instruments launch it");
    }
  } else {
    shouldPrelaunch = true;
  }
  return shouldPrelaunch;
}

async function setDeviceTypeInInfoPlist (app, deviceString) {
  if (_.isNull(app) || _.isUndefined(app)) { return; }
  let plistFile = path.resolve(app, "Info.plist");
  let isiPhone = deviceString.toLowerCase().indexOf("ipad") === -1;
  let deviceTypeCode = isiPhone ? 1 : 2;
  await plist.updatePlistFile(plistFile, {UIDeviceFamily: [deviceTypeCode]});
}

function unwrapEl (el) {
  if (typeof el === 'object' && el.ELEMENT){
    return el.ELEMENT;
  }
  return el;
}

export default { rootDir, removeInstrumentsSocket,
  appIsPackageOrBundle,  detectUdid, parseLocalizableStrings,
  shouldPrelaunchSimulator, setDeviceTypeInInfoPlist, getSimForDeviceString,
  unwrapEl };
