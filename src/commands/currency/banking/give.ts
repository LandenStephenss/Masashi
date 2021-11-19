import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import type Client from '../../../structures/Masashi.js';
import { CommandContext } from '../../../structures/Command.js';
import type { Message, User } from 'eris';

export default class Give extends CurrencyCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user)!,
      validate: (user: unknown, message: Message) => user !== undefined
      && !(user as User).bot
      && (user as User).id !== message.author.id,
      onFail: (_: unknown, user: unknown, message: Message) =>
        (user as User)?.id === message.author.id ? 'No.'
          : (user as User)?.bot
            ? 'You can\'t give coins to a bot!'
            : 'That does not seem to be a valid user.',
      onMissing: () => 'You need to give a user to send coins to.'
    },
    amount: {
      resolve: (amount: string) => amount === 'all' || parseInt(amount),
      validate: (amount: unknown) => amount === true || amount === amount,
      onFail: () => 'Invalid amount. Please provide a valid integer!',
      onMissing: () => 'You need to add an amount of coins to give the user!'
    },
  };

  constructor(public client: Client) {
    super({
      name: 'give',
      description: 'Give a user some coins',
      aliases: [],
      usage: '{c} <user> <amount>',
    });
  }

  async run({ message, args: { user, amount } }: CommandContext<this>) {
    const authorCoins = await message.author.getCoins();
    const allCoins = amount === true || authorCoins < amount;
    const actualAmount: number = allCoins ? authorCoins : amount;
    const response = allCoins ? 'all of your' : amount;
    const prompt = await this.client.createMessage(
      message.channel.id,
      `You're about to send ${response} coins to ${user.username}.\n\nAre you \
sure? Reply with yes or no.`
    );
    const answer = await this.client.awaitMessage(
      (msg) => !msg.author.bot
      && msg.author.id === message.author.id
      && ['yes', 'no', 'y', 'n'].includes(msg.content.toLowerCase()),
      30000
    )
      .catch(() => null);
    if (answer === null) {
      await prompt.edit('The action was automatically canceled.');
      return;
    }

    if (['yes', 'y'].includes(answer.content.toLowerCase())) {
      await user.addCoins(actualAmount);
      await message.author.removeCoins(actualAmount);
      return {
        embed: {
          author: {
            name: `You gave ${user.username} ${response} coins.`,
            icon_url: message.author.dynamicAvatarURL()
          }
        }
      };
    }
    else {
      return 'The action was cancelled.';
    }
  }
}
