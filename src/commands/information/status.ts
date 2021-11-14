import Client from '../../structures/Masashi.js';
import InfoCommand from '../../structures/categories/InfoCommand.js';
import formatNumber from '../../util/formatNumber.js';
import parseTime from '../../util/parseUptime.js';

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
            value: formatNumber(this.client.guilds.size),
            inline: true,
          },
          {
            name: 'Users',
            value: formatNumber(this.client.users.size),
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
            value: parseTime(this.client.uptime / 1000),
          },
        ],
        footer: {
          text: `Ping: ${this.client.shards.get(0)?.latency}ms`,
        },
      },
    };
  }
}
