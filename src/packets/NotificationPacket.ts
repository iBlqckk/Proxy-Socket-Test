import BufWrapper from '@minecraft-js/bufwrapper';

import Packet from './Packet';
import processColorCodes from '../utils/processColorCodes';

export default class NotificationPacket extends Packet<Notification> {
  public static id = 3;

  public constructor(buf?: BufWrapper) {
    super(buf);
  }

  public write(data: Notification): void {
    this.data = data;

    this.buf = new BufWrapper();
    this.buf.writeVarInt(NotificationPacket.id); // Packet ID

    this.buf.writeString(processColorCodes(data.title));
    this.buf.writeString(processColorCodes(data.message));
  }

  public read(): void {
    this.data = {
      title: this.buf.readString(),
      message: this.buf.readString(),
    };
  }
}

interface Notification {
  title: string;
  message: string;
}
