import Command, { CommandData } from '../Command.js';

export default abstract class InfoCommand extends Command {
  static category = 'info';

  constructor(data: CommandData) {
    super({
      category: 'info',
      ...data,
    });
  }
}
