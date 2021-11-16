import Item from '../../../structures/Item.js';

const responses = [
  'You ate the fish cake.',
  'You gave the fish cake to a friend'
];

export default class Blowfish extends Item {
  constructor() {
    super(
      'fishcake',
      'A tasty treat',
      1000,
      '🍥',
      80
    );
  }

  middleware() {
    return false;
  }

  use() {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
