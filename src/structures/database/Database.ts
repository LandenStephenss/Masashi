import { MongoClient, Collection } from 'mongodb';
import Guild, { AutoModSettings } from './DatabaseGuild.js';
import User, { Booster } from './DatabaseUser.js';
import Item, { ItemType } from '../Item.js';
import logger from '../../util/logger.js';
import type { Guild as erisGuild } from 'eris';

export default class Database {
  userDB!: Collection<User>;
  guildDB!: Collection<Guild>;

  async start() {
    const mongo = new MongoClient(process.env['DATABASE_URI']!);
    try {
      await mongo.connect();
      logger.info('connected to database!');

      const db = mongo.db('masashi');
      this.userDB = db.collection('users');
      this.guildDB = db.collection('guilds'); 
    } catch(e) {
      console.error(e); 
    }
  }

  // GUILD METHODS

  async ensureGuild(guildID: string) {
    if (
      await this.guildDB
        .countDocuments({ _id: guildID }, { limit: 1 })
        .then((res) => res === 0)
    ) {
      await this.guildDB.insertOne(new Guild(guildID));
    }
  }

  async getCurrencyLeaderboard(guild: erisGuild) {
    let arr = await this.userDB.find()
      .toArray();
    arr = arr
      .filter((user: User) => guild.members.has(user._id))
      .sort((a, b) => b.currency.wallet - a.currency.wallet)
      .slice(0, 10);
    return arr;
  }

  async getPrefix(guildID: string) {
    await this.ensureGuild(guildID);
    const guild = await this.guildDB.findOne({ _id: guildID });
    return guild!.settings.prefix;
  }

  async setPrefix(guildID: string, prefix: string) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne(
      { _id: guildID },
      { $set: { 'settings.prefix': prefix } }
    );
  }

  async getWelcomeMessage(guildID: string) {
    await this.ensureGuild(guildID);
    const guild = await this.guildDB.findOne({ _id: guildID });
    return guild?.messages.welcome;
  }

  async setWelcomeMessage(guildID: string, message: string) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne(
      { _id: guildID },
      { $set: { 'messages.welcome': message } }
    );
  }

  async getLeaveMessage(guildID: string) {
    await this.ensureGuild(guildID);
    const guild = await this.guildDB.findOne({ _id: guildID });
    return guild?.messages.leave;
  }

  async setLeaveMessage(guildID: string, message: string) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne(
      { _id: guildID },
      { $set: { 'messages.welcome': message } }
    );
  }

  async getMuteRole(guildID: string) {
    await this.ensureGuild(guildID);
    const guild = await this.guildDB.findOne({ _id: guildID });
    return guild?.settings.moderation.muteRole;
  }

  async setMuteRole(guildID: string, role: string) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne(
      { _id: guildID },
      { $set: { 'settings.moderation.muteRole': role } }
    );
  }

  async getModRole(guildID: string) {
    await this.ensureGuild(guildID);
    const guild = await this.guildDB.findOne({ _id: guildID });
    return guild?.settings.moderation.modRole;
  }

  async setModRole(guildID: string, role: string) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne(
      { _id: guildID },
      { $set: { 'settings.moderation.modRole': role } }
    );
  }

  async getAdminRole(guildID: string) {
    await this.ensureGuild(guildID);
    const guild = await this.guildDB.findOne({ _id: guildID });
    return guild?.settings.moderation.adminRole;
  }

  async setAdminRole(guildID: string, role: string) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne(
      { _id: guildID },
      { $set: { 'settings.moderation.adminRole': role } }
    );
  }

  async changeSettings(guildID: string, settings: AutoModSettings) {
    await this.ensureGuild(guildID);
    await this.guildDB.updateOne({ _id: guildID }, { $set: settings });
  }

  // USER METHODS

  async ensureUser(userID: string) {
    try {
      if (
        await this.userDB
          .countDocuments({ _id: userID }, { limit: 1 })
          .then((res) => res === 0)
      ) {
        await this.userDB.insertOne(new User(userID));
      }
    }
    catch(e) {
      console.error(e);
    }
  }

  async getUsersCoins(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user!.currency.wallet;
  }

  async addCoinsToUser(userID: string, amount: number) {
    await this.ensureUser(userID);
    const currentCoins = await this.getUsersCoins(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.wallet': currentCoins + amount } }
    );
  }

  async getXP(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({_id: userID});
    return user!.levels.xp;
  }

  async getLevel(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({_id: userID});
    return user!.levels.level;
  }

  async addXP(userID: string, amount: number) {
    await this.ensureUser(userID);
    const currentXP = await this.getXP(userID)!;
    await this.userDB.updateOne(
      {_id: userID}, {$set: {'levels.xp': currentXP + amount}}
    );

  }

  async increaseLevel(userID: string) {
    await this.ensureUser(userID);
    const oldLevel = await this.getLevel(userID);
    await this.userDB.updateOne({_id: userID}, 
      {$set: {'levels.level': oldLevel + 1}}
    );
  }

  async setLevel(userID: string, newLevel: number) {
    await this.ensureUser(userID);
    await this.userDB.updateOne({_id: userID}, 
      {$set: {'levels.level': newLevel}}
    );
  }

  async removeCoinsFromUser(userID: string, amount: number) {
    await this.ensureUser(userID);
    const currentCoins = await this.getUsersCoins(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.wallet': currentCoins - amount } }
    );
  }

  async getUsersBank(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user!.currency.bank;
  }

  async addCoinsToBank(userID: string, amount: number) {
    await this.ensureUser(userID);
    const currentBank = await this.getUsersBank(userID);
    const currentWallet = await this.getUsersCoins(userID);

    const actualAmount = currentWallet < amount ? currentWallet : amount;

    await this.userDB.updateOne(
      { _id: userID },
      {
        $set: {
          'currency.bank': currentBank + actualAmount,
          'currency.wallet': currentWallet - actualAmount,
        },
      }
    );
  }

  async removeCoinsFromBank(userID: string, amount: number) {
    await this.ensureUser(userID);
    const currentBank = await this.getUsersBank(userID);
    const currentWallet = await this.getUsersCoins(userID);

    const actualAmount = currentBank < amount ? currentBank : amount;

    await this.userDB.updateOne(
      { _id: userID },
      {
        $set: {
          'currency.bank': currentBank - actualAmount,
          'currency.wallet': currentWallet + actualAmount,
        },
      }
    );
  }

  async getStreak(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user!.currency.streak;
  }

  async increaseStreak(userID: string) {
    await this.ensureUser(userID);
    const streak = await this.getStreak(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.streak': streak + 1 } }
    );
  }

  async resetStreak(userID: string) {
    await this.ensureUser(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.streak': 0 } }
    );
  }

  async getLastDaily(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user?.currency.uses.daily;
  }

  async setLastDaily(userID: string) {
    await this.ensureUser(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.uses.daily': Date.now() } }
    );
  }

  async getLastWeekly(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user!.currency.uses.weekly;
  }

  async setLastWeekly(userID: string) {
    await this.ensureUser(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.uses.weekly': Date.now() } }
    );
  }

  async getLastMonthly(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user!.currency.uses.monthly;
  }

  async setLastMonthly(userID: string) {
    await this.ensureUser(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.uses.monthly': Date.now() } }
    );
  }

  async getLastYearly(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID });
    return user!.currency.uses.yearly;
  }

  async setLastYearly(userID: string) {
    await this.ensureUser(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { 'currency.uses.yearly': Date.now() } }
    );
  }

  async getInventory(userID: string) {
    await this.ensureUser(userID);
    const user = await this.userDB.findOne({ _id: userID })!;
    return user?.inventory;
  }

  async addItem(userID: string, item: Item, amount: number) {
    await this.ensureUser(userID);
    const inventory = await this.getInventory(userID);

    const newInventory = {
      ...inventory,
      [item.name]: {
        ...item,
        amount: (inventory![item.name]?.amount ?? 0) + amount,
      },
    };

    await this.userDB.updateOne(
      { _id: userID },
      { $set: { inventory: newInventory } }
    );
  }

  async removeItem(userID: string, item: ItemType, amount: number) {
    await this.ensureUser(userID);
    const inventory = await this.getInventory(userID);
    if (inventory![item.name]?.amount - amount < 0) {
      return;
    }
    const newInventory = {
      ...inventory,
      [item.name]: { ...item, amount: inventory![item.name].amount - amount },
    };

    await this.userDB.updateOne(
      { _id: userID },
      { $set: { inventory: newInventory } }
    );
  }

  async isBlacklisted(userID: string) {
    const user = await this.userDB.findOne({ _id: userID });
    return user?.blacklisted;
  }

  async setBlacklisted(userID: string) {
    await this.ensureUser(userID);
    const blacklisted = await this.isBlacklisted(userID);
    await this.userDB.updateOne(
      { _id: userID },
      { $set: { blacklisted: !blacklisted } }
    );
  }

  async deleteUser(userID: string) {
    await this.ensureUser(userID);
    await this.userDB.deleteOne({
      _id: userID,
    });
  }

  async giveBooster(userID: string, booster: Booster) {
    await this.ensureUser(userID);
    // TODO;
    console.log(booster);
  }
}
