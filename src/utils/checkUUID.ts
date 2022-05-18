import Player from '../player/Player';

export default function checkUUID(uuid: string, player: Player): boolean {
  const match =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(uuid);
  if (!match) player.sendConsoleMessage(`§c${uuid} is not a valid UUID!`);
  return match;
}
