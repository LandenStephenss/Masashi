import Command from '../../structures/Command.js';
import Client from '../../structures/Masashi.js';

export default class Ping extends Command {
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
