import { Client } from 'eris';
import { loadFiles } from '../util/loadFiles.js';
import logger from '../util/logger.js';
import  Command, { ExtendedCommand } from './Command.js';
import { ExtendedEvent } from './Event.js';

export default class Masashi extends Client {
  commands = new Map<string, Command>();
  aliases = new Map<string, string>();

  getCommand(name: string) {
    const command = this.commands.get(name);
    if (command) {
      return command;
    }
    const alias = this.aliases.get(name);
    return alias ? this.commands.get(alias) : undefined;
  }

  async loadCommands() {
    const commands = await loadFiles<ExtendedCommand>('../commands');
    for (const commandClass of commands) {
      const command = new commandClass(this);
      this.commands.set(command.help.name, command);
      for (const alias of command.config.aliases) {
        this.aliases.set(alias, command.help.name);
      }
      logger.info(`Loaded command '${command.help.name}'!`);
    }
  }

  async loadEvents() {
    const events = await loadFiles<ExtendedEvent>('../events');
    for (const eventClass of events) {
      const event = new eventClass(this);
      this.on(event.name, (...args) => event.run(...args));
      logger.info(`Loaded event '${event.name}'!`);
    }
  }

  async start() {
    logger.info('Starting Masashi...');
    await Promise.all([
      this.loadCommands(),
      this.loadEvents(),
    ]);
    logger.info('Connecting to Discord...');
    await this.connect();
  }
}
