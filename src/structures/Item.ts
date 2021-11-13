import type { MessageContent, User } from 'eris';

export interface ItemType {
  name: string,
  description: string,
  price: number,
  emoji: string,
  amount: number,
  rarity: number
}

export default abstract class Item {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public emoji: string,
    public rarity: number
  ) {}

  middleware(): boolean | Promise<boolean> {
    return true;
  }

  // Will return a string, this message will be sent to chat whenever
  // the item is used.
  use(user: User): MessageContent | Promise<MessageContent> {
    user;
    return 'test';
  }
}
