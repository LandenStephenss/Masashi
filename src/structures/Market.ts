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

  async purchase(user: User, item: Item) {
    user;
    item;
  }

  async sell(user: User, item: Item) {
    user;
    item;
  }
}

export type ExtendedItem = new () => Item;
