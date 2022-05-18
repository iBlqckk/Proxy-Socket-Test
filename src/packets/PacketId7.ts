import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class PacketId7 extends Packet<Id7> {
  public static id = 7;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: Id7): void {
    this.data = data;

    this.buf = new BufWrapper();
    this.buf.writeVarInt(PacketId7.id); // Packet ID

    this.buf.writeString(JSON.stringify(data.bulk));
  }

  public read(): void {
    this.data = {
      bulk: JSON.parse(this.buf.readString()),
    };
  }
}

interface Id7 {
  bulk: unknown[];
}
