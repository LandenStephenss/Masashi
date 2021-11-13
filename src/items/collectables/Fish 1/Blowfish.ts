import Item from '../../../structures/Item.js';
// import type { User } from 'eris';

const responses = [
  'You set your blowfish loose, was that really worth the 5,000 coins?',
  'Your blowfish died.',
];

export default class Blowfish extends Item {
  constructor() {
    super(
      'blowfish',
      'A pretty basic fish, it blows up, thats about it.',
      5000,
      '🐡',
      70
    );
  }

  middleware() {
    return false;
  }

  use() {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
