import Event from '../structures/Event.js';
import logger from '../util/logger.js';

export default class ReadyEvent extends Event {
  name = 'ready';

  run() {
    const { username, discriminator } = this.client.user;
    logger.info(`${username}#${discriminator} is now online!`);
  }
}
