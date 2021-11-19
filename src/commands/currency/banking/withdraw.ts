import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';

export default class Withdraw extends CurrencyCommand {
  args = {
    amount: {
      resolve: (amount: string) =>
        amount === 'all' ? 'all' : parseInt(amount),
      validate: (amount: unknown) => amount === 'all' || amount === amount,
      optional: false,
      onFail: () => 'Literally just say `all` or `42069`, it isn\'t that hard'
    },
  };

  constructor(public client: Client) {
    super({
      name: 'withdraw',
      description: 'Withdraw coins from your bank',
      aliases: ['with'],
      usage: '{c} <amount>',
    });
  }

  async run({ message, args: { amount } }: CommandContext<this>) {
    const currentCoins = await message.author.getBank();
    if (amount === 'all' || currentCoins <= amount) {
      await message.author.removeFromBank(currentCoins);
      return 'You withdrew all your coins from your bank.';
    }
    await message.author.removeFromBank(amount);
    return {
      embed: {
        author: {
          name: `You withdrew ${amount} coins`,
          icon_url: message.author.dynamicAvatarURL()
        }
      }
    };
  }
}
