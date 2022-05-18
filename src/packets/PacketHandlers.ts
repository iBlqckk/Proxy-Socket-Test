import { EventEmitter } from 'node:events';
import TypedEventEmitter from 'typed-emitter';
import BufWrapper from '@minecraft-js/bufwrapper';

import Player from '../player/Player';
import GiveEmotesPacket from './GiveEmotesPacket';
import PlayEmotePacket from './PlayEmotePacket';
import DoEmotePacket from './DoEmotePacket';
import JoinServerPacket from './JoinServerPacket';
import EquipEmotesPacket from './EquipEmotesPacket';
import NotificationPacket from './NotificationPacket';
import PlayerInfoPacket from './PlayerInfoPacket';
import ApplyCosmeticsPacket from './ApplyCosmeticsPacket';
import PlayerInfoRequestPacket from './PlayerInfoRequestPacket';
import FriendListPacket from './FriendListPacket';
import FriendMessagePacket from './FriendMessagePacket';
import PacketId7 from './PacketId7';
import ConsoleMessagePacket from './ConsoleMessagePacket';
import FriendRequestPacket from './FriendRequestPacket';
import FriendResponsePacket from './FriendResponsePacket';
import ForceCrashPacket from './ForceCrashPacket';
import KeepAlivePacket from './KeepAlivePacket';
import TaskListPacket from './TaskListPacket';
import HostListPacket from './HostListPacket';
import TaskListRequestPacket from './TaskListRequestPacket';
import HostListRequestPacket from './HostListRequest';
import ClientBanPacket from './ClientBanPacket';
import FriendUpdatePacket from './FriendUpdatePacket';

const OutgoingPackets = {
  giveEmotes: GiveEmotesPacket,
  playEmote: PlayEmotePacket,
  notification: NotificationPacket,
  playerInfo: PlayerInfoPacket,
  friendList: FriendListPacket,
  friendMessage: FriendMessagePacket,
  id7: PacketId7,
  friendRequest: FriendRequestPacket,
  friendResponse: FriendResponsePacket,
  forceCrash: ForceCrashPacket,
  taskListRequest: TaskListRequestPacket,
  hostListRequest: HostListRequestPacket,
  clientBan: ClientBanPacket,
  friendUpdate: FriendUpdatePacket,
  joinServer: JoinServerPacket,
};

// Outgoing is when a packet is sent by the server to the client
export class OutgoingPacketHandler extends (EventEmitter as new () => TypedEventEmitter<OutgoingPacketHandlerEvents>) {
  public static packets = Object.values(OutgoingPackets);

  private player: Player;

  public constructor(player: Player) {
    super();
    this.player = player;
  }

  public handle(data: Buffer): void {
    const buf = new BufWrapper(data);

    const id = buf.readVarInt();
    const Packet = OutgoingPacketHandler.packets.find((p) => p.id === id);

    if (!Packet) {
      // logger.warn('Unknown packet id (outgoing):', id, data.toString('hex'));
      return this.player.writeToClient(data);
    }

    const packet = new Packet(buf);
    packet.read();

    const event = Object.keys(OutgoingPackets).find(
      (key) => OutgoingPackets[key] === Packet
    );
    // @ts-ignore - event is type of string and not keyof OutgoingPacketHandlerEvents but it works anyway
    if (this.listenerCount(event) > 0) this.emit(event, packet);
    else this.player.writeToClient(data);
  }
}

type OutgoingPacketHandlerEvents = {
  [key in keyof typeof OutgoingPackets]: (
    packet: InstanceType<typeof OutgoingPackets[key]>
  ) => void;
};

const IncomingPackets = {
  doEmote: DoEmotePacket,
  consoleMessage: ConsoleMessagePacket,
  joinServer: JoinServerPacket,
  equipEmotes: EquipEmotesPacket,
  applyCosmetics: ApplyCosmeticsPacket,
  playerInfoRequest: PlayerInfoRequestPacket,
  friendMessage: FriendMessagePacket,
  friendRequest: FriendRequestPacket,
  friendResponse: FriendResponsePacket,
  keepAlive: KeepAlivePacket,
  taskList: TaskListPacket,
  hostList: HostListPacket,
};

// Incoming is when a packet is sent by the client to the server
export class IncomingPacketHandler extends (EventEmitter as new () => TypedEventEmitter<IncomingPacketHandlerEvents>) {
  public static packets = Object.values(IncomingPackets);

  private player: Player;

  public constructor(player: Player) {
    super();
    this.player = player;
  }

  public handle(data: Buffer): void {
    const buf = new BufWrapper(data);

    const id = buf.readVarInt();
    const Packet = IncomingPacketHandler.packets.find((p) => p.id === id);

    if (!Packet) {
      // logger.warn('Unknown packet id (incoming):', id, data);
      return this.player.writeToServer(data);
    }

    const packet = new Packet(buf);
    packet.read();

    const event = Object.keys(IncomingPackets).find(
      (key) => IncomingPackets[key] === Packet
    );
    // @ts-ignore - event is type of string and not keyof IncomingPacketHandlerEvents but it works anyway
    if (this.listenerCount(event) > 0) this.emit(event, packet);
    else this.player.writeToServer(data);
  }
}

type IncomingPacketHandlerEvents = {
  [key in keyof typeof IncomingPackets]: (
    packet: InstanceType<typeof IncomingPackets[key]>
  ) => void;
};
