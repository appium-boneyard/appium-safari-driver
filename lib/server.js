import log from './logger';
import { server as baseServer, routeConfiguringFunction } from 'appium-base-driver';
import { SafariDriver } from './driver';

async function startServer (port, host) {
  let d = new SafariDriver({port, host});
  let router = routeConfiguringFunction(d);
  let server = baseServer(router, port, host);
  log.info(`SafariDriver server listening on http://${host}:${port}`);
  return server;
}

export { startServer };
