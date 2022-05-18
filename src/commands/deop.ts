import { connectedPlayers } from '..';
import checkUUID from '../utils/checkUUID';
import getConfig, { editConfig } from '../utils/config';
import Command from './Command';

const command = new Command('deop', 'Remove someone from the operators list');

command.help = `usage: deop <uuid>`;

command.setHandler(async (player, command, args) => {
  const uuid = args[0];

  if (!checkUUID(uuid, player)) return;

  const config = await getConfig();
  await editConfig({
    ...config,
    operators: config.operators.filter((u) => u !== uuid),
  });
  player.sendConsoleMessage(`${uuid} has been removed from the operators list`);

  const connectedPlayer = connectedPlayers.find((p) => p.uuid === uuid);
  if (connectedPlayer) connectedPlayer.setOperatorState(false);
});

export default command;
