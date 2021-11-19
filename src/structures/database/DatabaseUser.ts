import type { ItemType } from '../Item.js';

export interface Booster {
  name: string,
  description: string,
  price: number,
  emoji: string,
  time: number
}

export default class DatabaseUser {
  currency = {
    wallet: 500,
    bank: 0,
    streak: 0,
    uses: {
      daily: null as number | null,
      weekly: null as number | null,
      monthly: null as number | null,
      yearly: null as number | null,
    },
  };
  inventory: Record<string, ItemType> = {};
  activeItems: string[] = [];
  blacklisted = false;
  boosters = {
    currency: {} as Record<string, unknown>,
    levels: {} as Record<string, unknown>,
  };
  levels = {
    level: 0,
    xp: 0
  };

  constructor(public _id: string) {}
}
