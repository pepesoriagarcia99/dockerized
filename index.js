/* eslint-disable no-console */
const { spawn } = require('node:child_process');

const findParameterValue = key => {
  const arg = process.argv.find(a => a.includes(key));
  if (arg) {
    const splArg = arg.split('=');
    return splArg[1];
  }
  return undefined;
};

const assignOutputEvents = command => {
  command.stdout.on('data', data => console.log(String(data)));
  command.stderr.on('data', data => console.log(String(data)));
  command.on('error', () => process.exit(1));
  command.on('close', code => console.log(`child process exited with code ${code}`));
};

const { name } = require('./package.json');
const image = `${name}:${findParameterValue('version') || 'latest'}`;

const component = `${findParameterValue('registry')}/${findParameterValue('project')}/${image}`;

const dockerBuild = spawn('docker', ['build', '-t', component, '.']);
assignOutputEvents(dockerBuild);
