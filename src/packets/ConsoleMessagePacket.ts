import BufWrapper from '@minecraft-js/bufwrapper';
import processColorCodes from '../utils/processColorCodes';

import Packet from './Packet';

export default class ConsoleMessagePacket extends Packet<ConsoleMessage> {
  public static id = 2;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: ConsoleMessage): void {
    this.data = data;

    this.buf = new BufWrapper();
    this.buf.writeVarInt(ConsoleMessagePacket.id); // Packet ID

    this.buf.writeString(processColorCodes(data.message));
  }

  public read(): void {
    this.data = {
      message: this.buf.readString(),
    };
  }
}

interface ConsoleMessage {
  message: string;
}
