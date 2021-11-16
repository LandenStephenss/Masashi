import CurrencyCommand from '../../../structures/categories/CurrencyCommand.js';
import Client from '../../../structures/Masashi';
import { CommandContext } from '../../../structures/Command';

export default class Inventory extends CurrencyCommand {
  args = {
    page: {
      resolve: (page: string) => parseInt(page),
      validate: (page: unknown) => !isNaN(page as number),
      optional: true,
    },
  };
  constructor(public client: Client) {
    super({
      name: 'inventory',
      description: 'View your inventory!',
      aliases: ['inv'],
      usage: '{c} <page>',
    });
  }
  async run({ message, args: { page } }: CommandContext<this>) {
    if (message.author.bot) {
      return {
        content: 'Bot\'s can\'t have an inventory!',
      };
    }
    const inventory = await message.author.getInventory();
    // @ts-ignore
    const arr = Object.entries(inventory)
      .filter((item) => item[1].amount >= 1);

    const maxPages = Math.ceil(arr.length / 8);
    let currentPage: number = page ?? 1;
    if (maxPages < currentPage) {
      currentPage = maxPages;
    }

    if (arr.length == 0) {
      return {
        embed: {
          title: 'You have no items in your inventory',
        },
      };
    }
    else {
      arr.slice((currentPage - 1) * 8, (currentPage - 1) * 8 + 8);
      return {
        embed: {
          title: `${message.author.username}'s Inventory!`,
          fields: arr.map((item) => ({
            name:
              `${item[1].emoji} ${item[1].name.split('')[0].toUpperCase() +
              item[1].name.split('')
                .slice(1)
                .join('')
                .toLowerCase()}`,
            value: item[1].amount.toString(),
          })),
          footer: {
            text: `Page: ${currentPage}`
          }
        },
      };
    }
  }
}
