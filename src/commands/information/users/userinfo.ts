import Client from '../../../structures/Masashi.js';
import InfoCommand from '../../../structures/categories/InfoCommand.js';
import { CommandContext } from '../../../structures/Command.js';

export default class UserInfo extends InfoCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user)!,
      validate: (user: unknown) => user !== undefined,
      optional: true
    }
  };

  constructor(public client: Client) {
    super({
      name: 'userinfo',
      description: 'View information about a user',
      aliases: ['whois'],
      usage: '{c} <user>'
    });
  }

  run({message, args: { user }}: CommandContext<this>) {
    user = user ?? message.author;
    const guildMember = this.client.guilds.get(message.channel.guild.id)
      ?.members.get(user.id)!;

    return {
      embed: {
        author: {
          name: `${user.username}#${user.discriminator}`,
          icon_url: user.avatarURL
        },
        fields: [
          {
            name: 'Created At',
            value: `<t:${user.createdAt / 1000}>`,
            inline: true,
          },
          {
            name: 'Joined At',
            value: `<t:${guildMember.joinedAt! / 1000}>`,
          },
          {
            name: `${guildMember.roles.length} Roles`,
            value: guildMember.roles
              .map((role) => `<@&${role}>`)
              .join(' ') || 'No Roles.'
          }
        ],
        footer: {
          text: `ID: ${user.id}`
        }
      }
    };
  }
}