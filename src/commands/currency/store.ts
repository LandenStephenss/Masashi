import CurrencyCommand from '../../structures/categories/CurrencyCommand.js';
import Client from '../../structures/Masashi';
import { CommandContext } from '../../structures/Command';
import Item from '../../structures/Item';
import { MessageContent } from 'eris';
export default class Store extends CurrencyCommand {
  args = {
    action: {
      resolve: (action: string) => action,
      validate: (action: unknown) =>
        action === 'buy' || action === 'sell' || action === 'page',
      optional: true,
    },
    // this could also be a page number, so check for that too.
    item: {
      resolve: (item: string) => item,
      validate: (item: unknown) => {
        if (this.client.market.has(item as string)) {
          return true;
        }
        else if (!isNaN(parseInt(item as string))) {
          return true;
        }
        else {
          return false;
        }
      },
      optional: false,
    },
    amount: {
      resolve: (amount: string) => parseInt(amount),
      validate: (amount: unknown) => !isNaN(amount as number),
      optional: true,
    },
  };

  constructor(public client: Client) {
    super({
      name: 'store',
      description: 'Buy some items from the store!',
      aliases: ['shop'],
      usage: '{c} <buy | sell | page> <item>',
    });
  }

  async sendStore(items: Item[], pageNumber: number): Promise<MessageContent> {
    return {
      embed: {
        title: 'Item Store!',
        fields: items.map((item) => ({
          name: `${item.emoji} ${item.name} (${item.price} coins)`,
          value: `${item.description}`,
        })),
        footer: {
          text: `Page: ${pageNumber}`,
        },
      },
    };
  }

  async run({ args, message }: CommandContext<this>) {
    if (!args.action) {
      const items: Item[] = [...this.client.market]
        .slice(0, 8)
        .map((item) => item[1]);
      const defaultEmbed = this.sendStore(items, 1);
      return defaultEmbed;
    }
    else {
      const items: Item[] = [...this.client.market].map((item) => item[1]);
      if (args.action === 'buy') {
        const item = this.client.market.get(args.item);
        if (!item) {
          return 'That item does not exist';
        }
        else {
          const buyItem = await this.client.market.purchase(
            message.author,
            item,
            args.amount ?? 1
          );

          return buyItem;
        }
      }
      else if (args.action === 'sell') {
        const item = this.client.market.get(args.item);
        if(!item) {
          return 'That item does not exist';
        }
        else {
          const sellItem = await this.client.market.sell(
            message.author,
            item,
            args.amount ?? 1
          );

          return sellItem;
        }
      }
      else if (args.action === 'page') {
        if (isNaN(args.item as number)) {
          return 'The input you provided for argument `page` is invalid!';
        }
        const maxPages = Math.ceil(items.length / 8);
        let currentPage: number = parseInt(args.item);
        if (currentPage > maxPages) {
          currentPage = maxPages;
        }
        const pagedStore = await this.sendStore(
          items.slice((currentPage - 1) * 8, (currentPage - 1) * 8 + 8),
          currentPage
        );
        return pagedStore;
      }
    }
  }
}
