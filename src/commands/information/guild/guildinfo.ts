import Client from '../../../structures/Masashi.js';
import InfoCommand from '../../../structures/categories/InfoCommand.js';
import { CommandContext } from '../../../structures/Command.js';

export default class Guildinfo extends InfoCommand {
  constructor(public client: Client) {
    super({
      name: 'guildinfo',
      description: 'View some information about a guild',
      aliases: ['gi'],
      usage: '{c}',
    });
  }

  async run({
    message: {
      channel: { guild },
    },
  }: CommandContext<this>) {
    const roles = guild.roles.filter((f) => f.id !== guild.id);
    const prefix = await guild.getPrefix();
    return {
      embed: {
        author: {
          name: guild.name,
          icon_url: guild.dynamicIconURL() ?? undefined,
        },
        fields: [
          {
            name: 'Members',
            value: guild.members.size.toString(),
            inline: true,
          },
          {
            name: 'Channels',
            value: guild.channels.size.toString(),
            inline: true
          },
          {
            name: `Roles (${roles.length})`,
            value: roles.map((role) => `<@&${role.id}>`)
              .join(', '),
            inline: true,
          },
          {
            name: 'AFK Channel',
            value: guild.afkChannelID === null ? 
              'None' : 
              `<#${guild.afkChannelID}>`
          }
        ],
        footer: {
          text: `${guild.name}'s prefix is ${prefix}`
        }
      },
    };
  }
}
