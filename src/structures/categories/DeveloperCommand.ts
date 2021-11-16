import type { MessageContent } from 'eris';
import Command, { CommandData, CommandContext } from '../Command.js';
import Masashi from '../Masashi.js';

export default abstract class DeveloperCommand extends Command {
  static category = 'developer';
  abstract client?: Masashi;

  constructor(data: CommandData) {
    super({
      category: 'developer',
      developer: true,
      ...data,
    });
  }

  middleware(context: CommandContext<this>): boolean | MessageContent {
    if (this.client?.developers.includes(context.message.author.id)) {
      return true;
    }
    else {
      return 'You must be a developer to run this command!';
    }
  }
}
