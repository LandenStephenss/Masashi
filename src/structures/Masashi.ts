import {
  Client,
  Member,
  Message,
  PartialEmoji,
  PossiblyUncachedMessage,
  Uncached,
} from 'eris';
import { loadFiles } from '../util/loadFiles.js';
import logger from '../util/logger.js';
import Command, { ExtendedCommand } from './Command.js';
import { ExtendedEvent } from './Event.js';
import Database from './database/Database.js';
import Market from './Market.js';

export default class Masashi extends Client {
  db = new Database();
  commands = new Map<string, Command>();
  aliases = new Map<string, string>();
  market = new Market(this);
  developers: string[] = [];

  resolveUser(user: string) {
    return this.users.get(/<@!?(\d+)>/g.exec(user)?.[1] ?? user)
    ?? this.users.find((u) => u.username.toLowerCase() === user.toLowerCase());
  }

  resolveCommand(name: string) {
    const command = this.commands.get(name);
    if (command) {
      return command;
    }
    const alias = this.aliases.get(name);
    return alias ? this.commands.get(alias) : undefined;
  }

  awaitMessage(filter: (message: Message) => boolean, timeout: number) {
    return new Promise<Message>((resolve, reject) => {
      const listener = (messageToCollect: Message) => {
        if (filter(messageToCollect)) {
          this.off('messageCreate', listener);
          resolve(messageToCollect);
        }
      };
      this.on('messageCreate', listener);
      setTimeout(() => {
        this.off('messageCreate', listener);
        reject(new Error('No message was collected in time.'));
      }, timeout);
    });
  }

  awaitReaction(
    filter: (input: AwaitReactionInput) => boolean,
    timeout: number
  ) {
    return new Promise<AwaitReactionInput>((resolve, reject) => {
      const listener = (
        message: PossiblyUncachedMessage,
        emoji: PartialEmoji,
        reactor: Uncached | Member
      ) => {
        const input = { message, emoji, reactor };
        if (filter(input)) {
          this.off('messageReactionAdd', listener);
          resolve(input);
        }
      };
      this.on('messageReactionAdd', listener);
      setTimeout(() => {
        this.off('messageReactionAdd', listener);
        reject(new Error('No reaction was collected in time.'));
      }, timeout);
    });
  }

  async loadCommands() {
    const commands = await loadFiles<ExtendedCommand>('../commands');
    for (const commandClass of commands) {
      const command = new commandClass(this);
      this.commands.set(command.help.name, command);
      for (const alias of command.config.aliases) {
        this.aliases.set(alias, command.help.name);
      }
      logger.info(`Loaded command '\u001b[32m${command.help.name}\u001b[37m'!`);
    }
  }

  async loadEvents() {
    const events = await loadFiles<ExtendedEvent>('../events');
    for (const eventClass of events) {
      const event = new eventClass(this);
      this.on(event.name, (...args) => event.run(...args));
      logger.info(`Loaded event '\u001b[33m${event.name}\u001b[37m'!`);
    }
  }

  async start() {
    logger.info('Starting Masashi...');
    await Promise.all([
      this.db.start(),
      this.loadCommands(),
      this.loadEvents(),
      this.market.loadItems(),
      this.getDevelopers(),
    ]);
    logger.info('Connecting to Discord...');
    await this.connect();
  }

  async getDevelopers() {
    this.developers = process.env['DEVELOPERS']!.split(',');
    const appInfo = await this.getOAuthApplication();
    if(!appInfo) {
      return
    }
    for (const member of appInfo.team!.members) {
      this.developers.push(member.user.id);
    }
  }
}

interface AwaitReactionInput {
  message: PossiblyUncachedMessage,
  emoji: PartialEmoji,
  reactor: Uncached | Member
}
