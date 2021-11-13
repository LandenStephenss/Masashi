import Client from '../../structures/Masashi.js';
import InfoCommand from '../../structures/categories/InfoCommand.js';

export default class Ping extends InfoCommand {
  constructor(public client: Client) {
    super({
      name: 'status',
      description: 'Bot status',
      aliases: ['stats'],
    });
  }

  run() {
    return {
      embed: {
        title: 'Masashi Status',
        fields: [
          {
            name: 'Guilds',
            value: this.client.guilds.size.toString(),
            inline: true,
          },
          {
            name: 'Users',
            value: this.client.users.size.toString(),
            inline: true,
          },
          {
            name: 'Memory Usage',
            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
              2
            )} MB`,
            inline: true,
          },
          {
            name: 'Uptime',
            value: '69 years'
          },
        ],
        footer: {
          text: `Ping: ${this.client.shards.get(0)?.latency}ms`,
        },
      },
    };
  }
}
