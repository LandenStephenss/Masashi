import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import type Client from '../../../structures/Masashi.js';
import { CommandContext } from '../../../structures/Command.js';
import type { User } from 'eris';

export default class Give extends CurrencyCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user)!,
      validate: (user: unknown) => user !== undefined && !(user as User).bot,
      onFail: (user: unknown) => (user as User).bot
        ? 'Coins cannot be given to a bot!'
        : 'Invalid user value.'
    },
    amount: {
      resolve: (amount: string) => amount === 'all' || parseInt(amount),
      validate: (amount: unknown) => amount === true || amount === amount,
      onFail: () => 'Invalid amount. Please provide a valid integer!'
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
    const allCoins = amount === true || amount < authorCoins;
    const actualAmount: number = allCoins ? authorCoins : amount;
    const response = allCoins ? 'all of your' : amount;

    const prompt = await this.client.createMessage(
      message.channel.id,
      `You're about to send ${response} coins to ${user.username}\n\nAre you \
sure? Reply with \`yes\` or \`no\`.`
    );
    const answer = await this.client.awaitMessage(
      (msg) => !message.author.bot
      && msg.author.id === message.author.id
      && ['yes', 'no', 'y', 'n'].includes(message.content.toLowerCase()),
      15000
    )
      .catch(() => null);

    if (answer === null) {
      await prompt.edit('The action was automatically canceled.');
      return;
    }

    if (['yes', 'y'].includes(answer.content.toLowerCase())) {
      await user.addCoins(actualAmount);
      await message.author.removeCoins(actualAmount);
      return `You gave ${user.username} ${response} coins.`;
    }
    else {
      return 'The action was cancelled.';
    }
  }
}
