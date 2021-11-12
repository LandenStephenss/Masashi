import type { TextChannel } from 'eris';
import Command, { CommandData, CommandContext } from '../Command.js';

export default abstract class NSFWCommand extends Command {
  static category = 'nsfw';

  constructor(data: CommandData) {
    super({
      category: 'nsfw',
      developer: true,
      ...data,
    });
  }

  middleware(context: CommandContext<this>) {
    return (context.message.channel as TextChannel).nsfw
      ? true 
      : 'You must be in an NSFW channel to use this command!';
  }
}
