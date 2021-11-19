import { User } from 'eris';
import Item from '../../../structures/Item.js';

const responses = [
  'You ate the fish cake.',
  'You gave the fish cake to {randUser}'
];
const sickResponses = [
  'You got sick and had to pay the hospital {coins} coins'
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

  async use(user: User) {
    const sickChance = Math.floor(Math.random() * 100);
    if(sickChance > 50) {
      let coins = Math.floor(Math.random() * 200);
      const userCoins = await user.getCoins();
      if(coins > userCoins) {
        coins = userCoins;
      }
      if(coins == 0) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
      else {
        user.removeCoins(coins);
        return sickResponses[Math.floor(Math.random() * sickResponses.length)]
          .replace('{coins}', coins.toString());
      }
    }
    else {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
}
