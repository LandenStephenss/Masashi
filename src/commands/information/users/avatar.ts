import Client from '../../../structures/Masashi.js';
import InfoCommand from '../../../structures/categories/InfoCommand.js';
import { CommandContext } from '../../../structures/Command.js';

export default class Avatar extends InfoCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user)!,
      validate: (user: unknown) => user !== undefined,
      optional: true
    }
  };
  constructor(public client: Client) {
    super({
      name: 'avatar',
      description: 'View a user\'s avatar',
      aliases: ['av'],
      usage: '{c} <user>'
    });
  }

  run({message, args: { user }}: CommandContext<this>) {
    user = user ?? message.author;
    return {
      embed: {
        image: {
          url: user.avatar === null ? 
            user.defaultAvatarURL : 
            user.dynamicAvatarURL() 
        },
        title: `${user.username}'s Avatar!`
      }
    };
  }
}
