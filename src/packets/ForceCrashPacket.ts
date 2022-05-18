import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';

export default class ForceCrashPacket extends Packet<ForceCrash> {
  public static id = 33;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: ForceCrash): void {
    this.data = data;

    this.buf = new BufWrapper();
    this.buf.writeVarInt(ForceCrashPacket.id); // Packet ID
  }

  public read(): void {
    this.data = {};
  }
}

interface ForceCrash {}
