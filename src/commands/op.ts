import { connectedPlayers } from '..';
import checkUUID from '../utils/checkUUID';
import getConfig, { editConfig } from '../utils/config';
import Command from './Command';

const command = new Command('op', 'Make someone an operator');

command.help = `usage: op <uuid>`;

command.setHandler(async (player, command, args) => {
  const uuid = args[0];

  if (!checkUUID(uuid, player)) return;

  const config = await getConfig();
  config.operators.push(uuid);
  await editConfig(config);
  player.sendConsoleMessage(`${uuid} has been added to the operators list`);

  const connectedPlayer = connectedPlayers.find((p) => p.uuid === uuid);
  if (connectedPlayer) connectedPlayer.setOperatorState(true);
});

export default command;
