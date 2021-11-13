import { loadFiles } from '../util/loadFiles.js';
import Item from './Item.js';
import { User } from 'eris';
import Masashi from './Masashi.js';

export default class Market extends Map<string, Item> {
  #itemsLoaded = false;

  constructor(public client: Masashi) {
    super();
  }

  async loadItems() {
    if (this.#itemsLoaded) {
      return;
    }
    const items = await loadFiles<ExtendedItem>('../items');
    for (const itemClass of items) {
      const item = new itemClass();

      this.set(item.name, item);
    }
    this.#itemsLoaded = true;
  }

  async purchase(user: User, item: Item, amount: number = 1) {
    user;
    item;
    amount;
    const userCoins = await user.getCoins();
    if (userCoins < item.price * amount) {
      return `You need ${
        item.price * amount - userCoins
      } more coins to purchase ${amount > 1 ? amount : 'a'} ${item.name}!`;
    }
    else {
      await user.removeCoins(item.price);
      await user.addItem(item, amount);
      return `You purchased ${amount > 1 ? amount : 'a'} ${item.name}`;
    }
  }

  async sell(user: User, item: Item, amount: number = 1) {
    const inventory = await user.getInventory();
    // @ts-ignore
    if (!inventory[item.name]) {
      return 'You do not own that item!';
    }
    else {
      const usersItem = inventory![item.name];
      console.log(usersItem);
      if (usersItem.amount < amount) {
        amount = usersItem.amount;
      }
      // @ts-ignore
      user.removeItem(item, amount);
      const sellPrice = item.price * 0.35 * amount;
      user.addCoins(sellPrice);
      return `You sold ${amount} ${item.name} for ${
        sellPrice
      }`;
    }
  }
}

export type ExtendedItem = new () => Item;
