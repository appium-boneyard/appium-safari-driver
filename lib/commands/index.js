import findExtensions from './find';
import elementExtensions from './element';
import loggingCommands from './logging';
import gestureExtensions from './gesture';
import alertExtensions from './alert';
import executeExtensions from './execute';
import generalExtensions from './general';
import contextCommands from './context';
import webCommands from './web';
import orientationCommands from './orientation';
import navigationCommands from './navigation';
import screenshotCommands from './screenshot';
import safariCommands from './safari';


let commands = {};

for (let obj of [
  findExtensions, elementExtensions, loggingCommands, gestureExtensions,
  alertExtensions, executeExtensions, generalExtensions, contextCommands,
  webCommands, orientationCommands, navigationCommands,
  screenshotCommands, safariCommands
]) {
  Object.assign(commands, obj);
}

export default commands;
