import type { MessageContent } from 'eris';
import Command, { CommandData, CommandContext } from '../Command.js';

export default abstract class DeveloperCommand extends Command {
  static category = 'developer';

  constructor(data: CommandData) {
    super({
      category: 'developer',
      developer: true,
      ...data,
    });
  }

  middleware(context: CommandContext<this>): boolean | MessageContent {
    if (process.env.DEVELOPERS?.includes(context.message.author.id)) {
      return true;
    }
    else {
      return 'You must be a developer to run this command!';
    }
  }
}
