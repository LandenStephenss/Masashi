import { CommandContext } from '../../structures/Command.js';
import Client from '../../structures/Masashi.js';
import InfoCommand from '../../structures/categories/InfoCommand.js';

export default class Help extends InfoCommand {
  args = {
    command: {
      resolve: (input: string) => this.client.getCommand(input)!,
      validate: (command: unknown) => command !== undefined,
      optional: true,
    },
  };

  constructor(public client: Client) {
    super({
      name: 'help',
      description: 'list the bot\'s commands',
      aliases: ['h', '?'],
    });
  }

  run({ args: { command } }: CommandContext<this>) {
    if (command !== undefined) {
      return `**__${
        command.help.name.split('')[0].toUpperCase() +
        command.help.name.split('')
          .slice(1)
          .join('')
      }__**:
__Description__: \`${command.help.description}\`
__Usage__: \`${command.help.usage.replace('{c}', command.help.name)}\`
${
  command.config.aliases.length >= 1
    ? `__Aliases__: \`${command.config.aliases.join('`, `')}\``
    : ''
}`;
    }
    else {
      const cats: string[] = [];
      this.client.commands.forEach((command) => {
        if (!cats.includes(command.help.category)) {
          cats.push(command.help.category);
        }
      });
      return `__Masashi Commands!__\n${cats
        .map(
          (f) =>
            `\n__${
              f.split('')[0].toUpperCase() + f.split('')
                .slice(1)
                .join('')
            }__:\n\`${[...this.client.commands]
              .filter((cmd) => cmd[1].help.category === f)
              .map((cmd) => `${cmd[1].help.name}`)
              .join('`, `')}\``
        )
        .join('\n')}`;
    }
  }
}
