import Command, { CommandContext } from '../src/structures/Command.js';

export default class COMMAND_NAME extends Command {
  args = {};

  constructor() {
    super({
      name: 'COMMAND_NAME',
    });
  }

  run(context: CommandContext<this>) {
    context;
  }
}
