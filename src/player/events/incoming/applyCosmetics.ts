import ApplyCosmeticsPacket from '../../../packets/ApplyCosmeticsPacket';
import Player from '../../Player';

export default function (player: Player, packet: ApplyCosmeticsPacket): void {
  for (const cosmetic of packet.data.cosmetics) {
    player.setCosmeticState(cosmetic.id, cosmetic.equipped);
  }
  player.clothCloak.fake = packet.data.clothCloak;

  // Sending the new state of the cosmetics to lunar
  const newPacket = new ApplyCosmeticsPacket();
  newPacket.write({
    ...packet.data,
    cosmetics: player.cosmetics.owned,
    // Non premium users can't change clothCloak
    clothCloak: player.premium.real
      ? packet.data.clothCloak
      : player.clothCloak.real,
  });
  player.writeToServer(newPacket);

  player.updateInstanceStorage();

  // No need to send the PlayerInfoPacket to other players because lunar is doing it for us :D
}
