import { Message, MessageContent,  } from 'eris';
import Event from '../structures/Event.js';

const usersInChannel: Map<string, string[]> = new Map();
let dropActive = false;

export default class MessageCreateEvent extends Event {
  name = 'messageCreate';

  async startDrop(message: Message) {
    dropActive = true;
    const grab = `\`${process.env['PREFIX']}grab\``;
    const warningMessage = await this.createMessage(
      message.channel.id,
      `A drop has appeared! Type ${grab} to grab it!\nYou have 10 seconds!`
    );
    try {
      const collected = await this.client.awaitMessage(
        (msg) => msg.content === grab,
        10000
      );
      await this.deleteMessages(message.channel.id, warningMessage);
      await this.createMessage(message.channel.id,
        `${collected.author.username} got the drop!`
      );
      // collected.author.updateCoins();
    }
    catch {
      this.deleteMessages(message.channel.id, warningMessage);
      const noGrab = await this.createMessage(
        message.channel.id,
        'no one grabbed the drop. :('
      );
      setTimeout(() => {
        this.deleteMessages(message.channel.id, noGrab);
      }, 10000);
    }
    dropActive = false;
  }
  
  manageDrops(message: Message) {
    let userIDs = usersInChannel.get(message.channel.id)!;
    if (!userIDs) {
      usersInChannel.set(message.channel.id, userIDs = []);
    }
    if(!userIDs.includes(message.author.id)) {
      userIDs.push(message.author.id);
      setTimeout(() => {
        usersInChannel.set(
          message.channel.id,
          userIDs.filter((userID) => userID !== message.author.id
          ));
      }, 300000);
    }
    const multiplier = userIDs.length >= 10 ? 10 : userIDs.length;

    if (!dropActive && Math.floor(Math.random() * 200) <= 5 + multiplier) {
      this.startDrop(message);
    }
  }

  async run(message: Message) {
    if (message.author.bot) {
      return;
    }

    this.manageDrops(message);

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

      if (!arg) {
        if (!commandArg.optional) {
          await this.createMessage(message.channel.id, 'Missing argument!');
          return;
        }
        break;
      }

      const argInput = commandArg.matchRest
        ? content.slice(arg.index)
        : arg[1]?.slice(1, -1) ?? arg[0];

      const value = await commandArg.resolve(argInput, message);
      if (!(await commandArg.validate?.(value, message) ?? true)) {
        await this.createMessage(message.channel.id, 'Argument is invalid!');
        return;
      }

      contextArgs[commandArgName] = value;

      if (commandArg.matchRest) {
        break;
      }
    }

    const context = {
      args: contextArgs,
      message,
      invokedAs: commandName
    };

    const middlewareResult = await command.middleware(context);
    if (middlewareResult !== true) {
      if (middlewareResult !== false) {
        await this.createMessage(message.channel.id, middlewareResult);
      }
      return;
    }

    const result = await command.run(context);

    if (!result) {
      return;
    }

    await this.createMessage(message.channel.id, result);
  }

  async createMessage(channelID: string, data: MessageContent) {
    const content = typeof data === 'string' ? data : data.content;
    const chunks = content?.match(/[\s\S]{1,2000}/g);

    const messagesSent = [];

    messagesSent.push(await this.client.createMessage(channelID, {
      ...typeof data === 'string' ? undefined : data,
      content: chunks?.shift(),
    }));
    
    for (const chunk of chunks ?? []) {
      messagesSent.push(await this.client.createMessage(channelID, chunk));
    }

    return messagesSent;
  }
  
  deleteMessages(channelID: string, messages: Message[], reason: string = '') {
    const messagesToDelete = messages.map((message) => message.id);
    return this.client.deleteMessages(channelID, messagesToDelete, reason);
  }
}
