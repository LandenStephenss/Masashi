import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';

export default class Balance extends CurrencyCommand {
  args = {
    user: {
      resolve: (user: string) => this.client.resolveUser(user)!,
      validate: (user: unknown) => user !== undefined,
      optional: true,
    },
  };

  constructor(public client: Client) {
    super({
      name: 'balance',
      description: 'View your balance!',
      aliases: ['bal', 'wallet', 'bank'],
      usage: '{c} <user>',
    });
  }
  async run({ message, args: { user } }: CommandContext<this>) {
    user = user ?? message.author;
    if(user.bot) {
      return 'Bot\'s can\'t have a wallet!';
    }
    const userCoins = await user.getCoins();
    const bankCoins = await user.getBank();
    return {
      embed: {
        title: `${user.username}'s Balance`,
        //         description: `__Wallet__: ${userCoins}
        // __Bank__: ${bankCoins}`,
        fields: [
          { name: 'Wallet', value: userCoins.toString() },
          { name: 'Bank', value: bankCoins.toString() },
        ],
        footer: {
          text: `Total: ${userCoins + bankCoins}`,
        },
      },
    };
  }
}
