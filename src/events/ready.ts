import Client from '../structures/Client.js';
import { logger } from '../util/logger.js';
export default class Ready {
  constructor(public client: Client) {
    this.client = client;
  }

  run() {
    logger.info(`${this.client.user.username} is now online!`);
  }
}