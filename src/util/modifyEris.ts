import { User, Guild } from 'eris';
import Masashi from '../structures/Masashi.js';

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
    getInventory(): Promise<object>,
    removeItemFromInventory(): Promise<void>,
    addItemToInventory(): Promise<void>,
    isBlacklisted(): Promise<boolean | undefined>,
    toggleBlacklist(): Promise<void>,
    giveBooster(): Promise<null>
    
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
    changeSettings(settings: object): Promise<void>
  }
}

User.prototype.toggleBlacklist = function() {
  return this._client.db.setBlacklisted(this.id);
};

User.prototype.addCoins = function (amount) {
  return this._client.db.addCoinsToUser(this.id, amount);
};

User.prototype.getCoins = function () {
  return this._client.db.getUsersCoins(this.id);
};

User.prototype.removeCoins = function (amount) {
  return this._client.db.removeCoinsFromUser(this.id, amount);
};

User.prototype.getBank = function () {
  return this._client.db.getUsersBank(this.id);
};

User.prototype.addToBank = function (amount) {
  return this._client.db.addCoinsToBank(this.id, amount);
};

User.prototype.isBlacklisted = function () {
  return this._client.db.isBlacklisted(this.id);
};

User.prototype.removeFromBank = function (amount) {
  return this._client.db.removeCoinsFromBank(this.id, amount);
};

Guild.prototype.getPrefix = function () {
  return this._client.db.getPrefix(this.id);
};

Guild.prototype.setPrefix = function (prefix) {
  return this._client.db.setPrefix(this.id, prefix);
};
