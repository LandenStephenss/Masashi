import DevCommand from '../../structures/categories/DeveloperCommand.js';
import Client from '../../structures/Masashi.js';

export default class Restart extends DevCommand {
  constructor(public client: Client) {
    super({
      name: 'restart',
      description: 'Restart the bot',
      aliases: ['kys'],
    });
  }

  async run() {
    queueMicrotask(() => {
      this.client.disconnect({ reconnect: false });
      queueMicrotask(() => process.exit());
    });
  }
}
