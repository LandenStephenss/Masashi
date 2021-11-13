import CurrencyCommand from '../../structures/categories/CurrencyCommand.js';
import Client from '../../structures/Masashi';
import { CommandContext } from '../../structures/Command';

export default class Store extends CurrencyCommand {
  args = {
    action: {
      resolve: (action: string) => action,
      validate: (action: unknown) => action === 'buy' || action === 'sell',
      optional: true,
    },
    item: {
      resolve: (item: string) => item,
      validate: (item: unknown) => item !== undefined,
      optional: false,
    },
  };

  constructor(public client: Client) {
    super({
      name: 'store',
      description: 'Buy some items from the store!',
      aliases: ['shop'],
      usage: '{c} <buy | sell> <item>',
    });
  }

  async run({ args }: CommandContext<this>) {
    if(!args.action) {
      // send shop embed
    }
    else {
      if(args.action === 'buy') {
        // user buys the item
      }
      else if(args.action === 'sell') {
        // user sells the item
      }
    }
  }
}
