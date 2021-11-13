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
    });
  }

  async run({ args: { command }, message }: CommandContext<this>) {
    if (message.channel.type !== 0) {
      return;
    }
    if (command !== undefined) {
      const prefix =
        (await message.channel.guild.getPrefix()) ?? process.env['PREFIX'];
      const msg = {
        embed: {
          title:
            command.help.name.split('')[0].toUpperCase() +
            command.help.name.split('')
              .slice(1)
              .join(''),
          fields: [
            { name: 'Description', value: command.help.description },
            {
              name: 'Usage',
              value:
                prefix + command.help.usage.replace('{c}', command.help.name),
            },
          ],
        },
      };

      if (command.config.aliases.length >= 1) {
        msg.embed.fields.push({
          name: 'Aliases',
          value: `\`${command.config.aliases.join('`, `')}\``,
        });
      }
      return msg;
    }
    else {
      const cats: string[] = [];
      this.client.commands.forEach(async (command) => {
        if (!cats.includes(command.help.category)) {
          cats.push(command.help.category);
        }
      });
      return {
        embed: {
          title: 'Masashi Commands!',
          fields: cats.map((cat) => ({
            name:
              cat.split('')[0].toUpperCase() + cat.split('')
                .slice(1)
                .join(''),
            value: `\`${[...this.client.commands]
              .filter(
                (command) =>
                  command[1].help.category.toLowerCase() === cat.toLowerCase()
              )
              .map((command) => command[1].help.name)
              .join('`, `')}\``,
          })),
        },
      };
    }
  }
}
