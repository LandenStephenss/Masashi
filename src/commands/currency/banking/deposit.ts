import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';

export default class Deposit extends CurrencyCommand {
  args = {
    amount: {
      resolve: (amount: string) =>
        amount === 'all' ? 'all' : parseInt(amount),
      validate: (amount: unknown) => amount === 'all' || amount === amount,
      optional: false,
      onFail: () => 'Literally just say `all` or `42069`, it isn\'t that hard.',
      onMissing: () => 'You should probably input an amount.'
    },
  };

  constructor(public client: Client) {
    super({
      name: 'deposit',
      description: 'Deposit coins into your bank',
      aliases: ['dep'],
      usage: '{c} <amount>',
    });
  }

  async run({ message, args: { amount } }: CommandContext<this>) {
    const currentCoins = await message.author.getCoins();
    if (amount === 'all' || currentCoins <= amount) {
      await message.author.addToBank(currentCoins);
      return 'You deposited all your coins into your bank.';
    }
    await message.author.addToBank(amount);
    return {
      embed: {
        author: {
          name: `You deposited ${amount} coins`,
          icon_url: message.author.dynamicAvatarURL()
        },
      },
    };
  }
}