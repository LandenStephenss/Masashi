import { Message } from 'eris';
import Event from '../structures/Event.js';

export default class MessageCreateEvent extends Event {
  name = 'messageCreate';

  async run(message: Message) {
    if (message.author.bot) {
      return;
    }

    const prefix = process.env['PREFIX']!;
    if (!message.content.startsWith(prefix)) {
      return;
    }

    const content = message.content.substring(prefix.length);
    const matches = content.matchAll(/('.+?'|".+?"|`.+?`)|[\S]+/g);

    const commandName: string = matches.next().value[0];
    const command = this.client.getCommand(commandName);
    if (!command) {
      return;
    }

    const contextArgs: Record<string, unknown> = {};

    for (const commandArgName in command.args) {
      const arg: RegExpMatchArray = matches.next().value;
      const commandArg = command.args[commandArgName];

      if (!arg && !commandArg.optional) {
        this.client.createMessage(message.channel.id, 'missing argument!');
        return;
      }

      if (!arg && commandArg.optional) {
        break;
      }

      const argInput = commandArg.matchRest
        ? content.slice(arg.index)
        : arg[1]?.slice(1, -1) ?? arg[0];

      const value = await commandArg.resolve(argInput, message);
      if (!(await commandArg.validate?.(value, message) ?? true)) {
        this.client.createMessage(message.channel.id, 'argument is invalid!');
        return;
      }

      contextArgs[commandArgName] = value;

      if (commandArg.matchRest) {
        break;
      }
    }

    const result = await command.run({
      args: contextArgs,
      message,
      invokedAs: commandName,
    });

    if (!result) {
      return;
    }

    const resultContent = typeof result === 'string' ? result : result.content;
    const chunks = resultContent?.match(/[\s\S]{1,2000}/g);

    await this.client.createMessage(message.channel.id, {
      ...typeof result === 'string' ? undefined : result,
      content: chunks?.shift(),
    });

    for (const chunk of chunks ?? []) {
      await this.client.createMessage(message.channel.id, chunk);
    }
  }
}
