import Command, { CommandData } from '../Command.js';

export default abstract class NSFWCommand extends Command {
  static category = 'levels';

  constructor(data: CommandData) {
    super({
      category: 'levels',
      developer: false,
      ...data,
    });
  }
}
