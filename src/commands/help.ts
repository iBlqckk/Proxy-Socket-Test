import Command from './Command';
import CommandHandler from './CommandHandler';

const command = new Command('help', 'Get this help message');

command.setHandler((player) => {
  player.sendConsoleMessage('Available commands:');
  CommandHandler.commands.forEach((c) => {
    player.sendConsoleMessage(`  ${c.command}   ${c.description}`);
  });
  player.sendConsoleMessage(' ');
  player.sendConsoleMessage('Use "command --help" to see command help message');
});

export default command;
