import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';

export default class Give extends CurrencyCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user)!,
      validate: (user: unknown) => user !== undefined,
      optional: false,
    },
    amount: {
      resolve: (amount: string) =>
        amount === 'all' ? 'all' : parseInt(amount),
      validate: (amount: unknown) =>
        !isNaN(amount as number) && (amount as number) >= 1,
      optional: false,
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
    if (user?.bot) {
      return 'You can\'t give a bot coins!';
    }
    else {
      const authorCoins: number = await message.author.getCoins();
      if (authorCoins < amount) {
        return `You need ${
          (amount as number) - authorCoins
        } more coins to do that!`;
      }
      else {
        await message.author.removeCoins(amount as number);
        await user.addCoins(amount as number);
        return `You gave ${user.username} ${amount} coins`;
      }
    }
  }
}
