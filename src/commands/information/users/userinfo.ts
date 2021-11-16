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
    if(message.channel.type !== 0) {
      return;
    }
    user = user ?? message.author;
    const guildMember = this.client.guilds.get(message.channel.guild.id)
      ?.members.get(user.id)!;

    return {
      embed: {
        author: {
          name: `${user.username}#${user.discriminator}`,
          icon_url: user.dynamicAvatarURL('png', 512)
        },
        fields: [
          {
            name: 'Created At',
            value: new Date(user.createdAt)
              .toLocaleString(),
            inline: true,
          },
          {
            name: 'Joined At',
            value: new Date(guildMember.joinedAt)
              .toLocaleString(),
          },
          {
            name: `Roles [${
              guildMember.roles.filter(
                // @ts-ignore: pls
                (role) => role !== message.channel.guild.id
              )
                .length - 1
            }]:`,
            value: guildMember.roles
            // @ts-ignore: shut up
              .filter((role) => role !== message.channel.guild.id)
              .map((role) => `<@&${role}>`)
              .join(' ')
          }
        ],
        footer: {
          text: `ID: ${user.id}`
        }
      }
    };
  }
}