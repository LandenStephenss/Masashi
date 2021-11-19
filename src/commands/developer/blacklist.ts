import DevCommand from '../../structures/categories/DeveloperCommand.js';
import { CommandContext } from '../../structures/Command.js';
import Client from '../../structures/Masashi.js';

export default class Restart extends DevCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user),
      validate: (user: unknown) => user !== undefined,
      optional: false,
      onFail: () => 'lol idiot, use an actual user.'
    },
  };
  constructor(public client: Client) {
    super({
      name: 'blacklist',
      description: 'Blacklist a user from the bot',
      aliases: ['kys'],
    });
  }

  async run({ args: { user } }: CommandContext<this>) {
    const isBlacklisted = await user?.isBlacklisted();
    user?.toggleBlacklist();
    return `${user?.username} (${user?.id}) is ${
      isBlacklisted ? 'no longer' : 'now'
    } blacklisted!`;
  }
}
