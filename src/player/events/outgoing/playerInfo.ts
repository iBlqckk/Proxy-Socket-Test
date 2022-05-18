import { connectedPlayers } from '../../..';
import PlayerInfoPacket from '../../../packets/PlayerInfoPacket';
import Player from '../../Player';

export default function (player: Player, packet: PlayerInfoPacket): void {
  if (packet.data.uuid === player.uuid) {
    // Player info for player player
    player.cosmetics.owned = packet.data.cosmetics;
    // Removing the owned cosmetics from the fake list
    player.cosmetics.fake = player.cosmetics.fake.filter(
      (c) => !player.cosmetics.owned.find((o) => o.id === c.id)
    );
    player.premium.real = packet.data.premium;
    player.color.real = packet.data.color;
    player.clothCloak.real = packet.data.clothCloak;
    player.plusColor.real = packet.data.plusColor;

    player.updateInstanceStorage();

    // Sending the owned and fake cosmetics to the client
    const newPacket = new PlayerInfoPacket();
    newPacket.write({
      ...packet.data,
      cosmetics: [...player.cosmetics.fake, ...player.cosmetics.owned],
      premium: player.premium.fake,
      color: player.color.fake,
      clothCloak: player.clothCloak.fake,
      plusColor: player.plusColor.fake,
    });
    return player.writeToClient(newPacket);
  }

  const connectedPlayer = connectedPlayers.find(
    (p) => p.uuid === packet.data.uuid
  );
  // If the player is not on the player websocket, sending back the original packet
  if (!connectedPlayer) return player.writeToClient(packet);

  const newPacket = new PlayerInfoPacket();
  newPacket.write({
    ...packet.data,
    ...connectedPlayer.getPlayerInfo(),
  });
  player.writeToClient(newPacket);
}
