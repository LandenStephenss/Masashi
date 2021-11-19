import DevCommand from '../../structures/categories/DeveloperCommand.js';
import { CommandContext } from '../../structures/Command.js';
import util from 'util';
import Client from '../../structures/Masashi.js';
export default class Restart extends DevCommand {
  args = {
    code: {
      resolve: (code: string) => code,
      validate: (code: unknown) => code !== undefined,
      onMissing: () => 
        'You kinda need to add some code for this to work retard.',
      optional: false,
      matchRest: true,
    },
  };
  constructor(public client: Client) {
    super({
      name: 'eval',
      description: 'Eval some code',
      aliases: ['e'],
    });
  }

  async run({ message, args: { code } }: CommandContext<this>) {
    if (code.includes('this.client.token')) {
      this.client.addMessageReaction(message.channel.id, message.id, '👎');
    }
    else {
      try {
        const startTime = process.hrtime();
        let type;
        let evaled = await eval(code);
        if (evaled !== undefined && typeof evaled.then === 'function') {
          evaled = await evaled;
          type = `Promise<${
            evaled != null ? evaled.constructor.name : 'void'
          }>`;
        }
        else {
          type = evaled != null ? evaled.constructor.name : 'void';
        }

        const inspected = util.inspect(evaled, { depth: 0 });
        const stopTime = process.hrtime(startTime);

        return {
          embed: {
            title: `Success || Evaled in ${
              stopTime[0] > 0 ? `${stopTime[0]}s ` : ''
            }${stopTime[1] / 1000000}ms`,
            color: 4961603,
            fields: [
              { name: 'Input:', value: `\`\`\`js\n${code}\`\`\`` },
              { name: 'Output:', value: `\`\`\`js\n${inspected}\`\`\`` },
            ],
            footer: {
              text: `Type: ${type}`,
            },
          },
        };
      }
      catch (e) {
        return {
          embed: {
            title: 'Error',
            fields: [
              { name: 'Input:', value: `\`\`\`js\n${code}\`\`\`` },
              { name: 'Output:', value: `\`\`\`js\n${e}\`\`\`` },
            ],
          },
        };
      }
    }
  }
}
