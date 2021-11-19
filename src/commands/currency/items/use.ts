import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';

export default class Use extends CurrencyCommand {
  args = {
    item: {
      resolve: (item: string) => this.client.market.get(item),
      validate: (item: unknown) => item !== undefined,
      optional: false,
      onFail: (_: unknown, item: unknown) => `\`${item}\` is not a valid item`,
      onMissing: () => 'You need to have an item name'
    },
  };
  constructor(public client: Client) {
    super({
      name: 'use',
      description: 'Use an item',
      usage: '{c} <item>',
    });
  }
  async run({ 
    message: { author, channel: { guild} }, 
    args: { item } 
  }: CommandContext<this>) {
    if(!item) {
      return;
    }
    const inventory = await author.getInventory()!;
    if(inventory![item.name].amount == 0) {
      return `You do not have \`${item.name}\``;
    }
    else {
      const useItem = await item.use(author);

      if(!useItem) {
        return `You used \`${item.name}\``;
      }
      else {
        return useItem?.replace('{randUser}', guild.members.random()!.username);
      }

    }
  }
}
