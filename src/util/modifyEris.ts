import { User, Guild } from 'eris';
import Masashi from '../structures/Masashi.js';
import DatabaseUser from '../structures/database/DatabaseUser';
import Item, {ItemType} from '../structures/Item.js';

declare module 'eris' {
  export interface User {
    _client: Masashi,
    addCoins(amount: number): Promise<void>,
    getCoins(): Promise<number>,
    removeCoins(amount: number): Promise<void>,
    getBank(): Promise<number>,
    addToBank(amount: number): Promise<void>,
    removeFromBank(amount: number): Promise<void>,
    getStreak(): Promise<number>,
    increaseStreak(): Promise<void>,
    resetStreak(): Promise<void>,
    lastDaily(): Promise<number>,
    setLastDaily(): Promise<void>,
    LastWeekly(): Promise<number>,
    setLastWeekly(): Promise<void>,
    lastMonthly(): Promise<number>,
    setLastMonthly(): Promise<void>,
    lastYearly(): Promise<number>,
    setLastYearly(): Promise<void>,
    getInventory(): Promise<Record<string, ItemType> | undefined>,
    removeItem(item: ItemType, amount: number): Promise<void>,
    addItem(item: Item, amount: number): Promise<void>,
    isBlacklisted(): Promise<boolean | undefined>,
    toggleBlacklist(): Promise<void>,
    giveBooster(): Promise<null>,
    deleteUser(): Promise<void>,
    getXP(): Promise<number>,
    getLevel(): Promise<number>,
    addXP(amount: number): Promise<void>,
    increaseLevel(): Promise<void>
  }

  export interface Guild {
    _client: Masashi,
    getPrefix(): Promise<string>,
    setPrefix(prefix: string): Promise<void>,
    getWelcomeMessage(): Promise<string>,
    setWelcomeMessage(message: string): Promise<void>,
    getLeaveMessage(): Promise<string>,
    setLeaveMessage(message: string): Promise<void>,
    getMuteRole(): Promise<string>,
    setMuteRole(role: string): Promise<string>,
    getModRole(): Promise<string>,
    setModRole(role: string): Promise<void>,
    getAdminRole(): Promise<string>,
    setAdminRole(role: string): Promise<void>,
    changeSettings(settings: object): Promise<void>,
    getRichUsers(): Promise<DatabaseUser[]>
  }
}

User.prototype.addXP = function(amount: number) {
  return this._client.db.addXP(this.id, amount);
};

User.prototype.increaseLevel = function() {
  return this._client.db.increaseLevel(this.id);
};

User.prototype.getXP = function() {
  return this._client.db.getXP(this.id);
};

User.prototype.getLevel = function() {
  return this._client.db.getLevel(this.id);
};

User.prototype.removeItem = function(item: ItemType, amount: number) {
  return this._client.db.removeItem(this.id, item, amount);
};
/**
 * Get a user's inventory
 */
User.prototype.getInventory = function() {
  return this._client.db.getInventory(this.id);
};
/**
 * Add's an item to the users inventory
 */
User.prototype.addItem = function (item: Item, amount: number) {
  return this._client.db.addItem(this.id, item, amount);
};
/**
 * Delete's the user's database entry
 */
User.prototype.deleteUser = function () {
  return this._client.db.deleteUser(this.id);
};

/**
 * Toggles the user's blacklist status
 */
User.prototype.toggleBlacklist = function () {
  return this._client.db.setBlacklisted(this.id);
};

/**
 * Adds coins to the user's wallet
 */
User.prototype.addCoins = function (amount) {
  return this._client.db.addCoinsToUser(this.id, amount);
};

/**
 * Returns the amount of coins that a user has in their wallet
 */
User.prototype.getCoins = function () {
  return this._client.db.getUsersCoins(this.id);
};

/**
 * Nukes coins from the user's wallet, used for purchasing items and stuff.
 */
User.prototype.removeCoins = function (amount) {
  return this._client.db.removeCoinsFromUser(this.id, amount);
};

/**
 * Returns the amount of coins that a user has in their bank
 */
User.prototype.getBank = function () {
  return this._client.db.getUsersBank(this.id);
};

/**
 * Takes coins from the users wallet and adds them to their bank
 */
User.prototype.addToBank = function (amount) {
  return this._client.db.addCoinsToBank(this.id, amount);
};

/**
 * Returns if the user is blacklisted or not
 */
User.prototype.isBlacklisted = function () {
  return this._client.db.isBlacklisted(this.id);
};
/**
 * Takes coins from the users bank and puts them into their wallet
 */
User.prototype.removeFromBank = function (amount) {
  return this._client.db.removeCoinsFromBank(this.id, amount);
};

/**
 * Returns the guilds prefix
 */
Guild.prototype.getPrefix = function () {
  return this._client.db.getPrefix(this.id);
};
/**
 * Sets the guilds prefix
 */
Guild.prototype.setPrefix = function (prefix) {
  return this._client.db.setPrefix(this.id, prefix);
};
/**
 * Returns the richest users in the guild
 */
Guild.prototype.getRichUsers = function () {
  return this._client.db.getCurrencyLeaderboard(this);
};
