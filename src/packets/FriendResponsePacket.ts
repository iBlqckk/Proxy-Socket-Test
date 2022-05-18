import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class FriendResponsePacket extends Packet<FriendResponse> {
  public static id = 21;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: FriendResponse): void {
    this.data = data;

    this.buf = new BufWrapper();
    this.buf.writeVarInt(FriendResponsePacket.id); // Packet ID

    this.buf.writeBoolean(data.accepted);
    this.buf.writeString(data.uuid);
  }

  public read(): void {
    this.data = {
      accepted: this.buf.readBoolean(),
      uuid: this.buf.readString(),
    };
  }
}

interface FriendResponse {
  accepted: boolean;
  uuid: string;
}
