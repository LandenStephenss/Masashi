import Client from '../../structures/Masashi.js';
import InfoCommand from '../../structures/categories/InfoCommand.js';

export default class Ping extends InfoCommand {
  constructor(public client: Client) {
    super({
      name: 'ping',
      description: 'A basic ping command',
      aliases: ['latency'],
    });
  }

  run() {
    return `Pong! ⏳ ${this.client.shards.get(0)?.latency}ms`;
  }
}
