import Command, { CommandData } from '../Command.js';

export default abstract class CurrencyCommand extends Command {
  static category = 'currency';

  constructor(data: CommandData) {
    super({
      category: 'currency',
      ...data,
    });
  }
}
