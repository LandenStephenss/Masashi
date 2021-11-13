import { Message, MessageContent, TextChannel } from 'eris';
import Event from '../structures/Event.js';

const usersInChannel: Map<string, string[]> = new Map();
let dropActive = false;

export default class MessageCreateEvent extends Event {
  name = 'messageCreate';

  async startDrop(message: Message, multiplier: number) {
    dropActive = true;
    const grab = `${await (
      message.channel as TextChannel
    ).guild.getPrefix()}grab`;

    const timeout = 10000 - multiplier * 500;
    const warningMessage = await this.createMessage(
      message,
      `A coin drop appeared! Type \`${grab}\` to grab it! The drop will` +
      ` disappear in ${timeout / 1000} seconds!`
    );

    const collected = await this.client
      .awaitMessage(
        (msg) => !message.author.bot && msg.content === grab,
        timeout
      )
      .catch(() => null);

    await this.deleteMessages(message.channel.id, warningMessage);

    if (!collected) {
      await this.createMessage(message, 'The coin drop got away...');
    }
    else {
      const coinDrop = Math.floor(Math.random() * (500 - 250)) + 250;
      const amount = coinDrop + Math.floor(coinDrop * multiplier / 10);
      await this.createMessage(message, {
        content: `You grabbed the coin drop and gained ${amount} coins!`,
        // messageReference: {
        //   messageID: collected.id,
        // },
      });
      await collected.author.addCoins(amount);
    }
    dropActive = false;
  }

  manageDrops(message: Message) {
    let userIDs = usersInChannel.get(message.channel.id)!;
    if (!userIDs) {
      usersInChannel.set(message.channel.id, (userIDs = []));
    }
    if (!userIDs.includes(message.author.id)) {
      userIDs.push(message.author.id);
      setTimeout(() => {
        usersInChannel.set(
          message.channel.id,
          userIDs.filter((userID) => userID !== message.author.id)
        );
      }, 300000);
    }
    const multiplier = userIDs.length > 10 ? 10 : userIDs.length;

    if (!dropActive && Math.floor(Math.random() * 200) < 5 + multiplier) {
      this.startDrop(message, multiplier);
    }
  }

  async run(message: Message) {
    if (message.author.bot || message.channel.type !== 0) {
      return;
    }
    const isBlacklisted = await message.author.isBlacklisted();
    if(isBlacklisted) {
      return;
    }
    queueMicrotask(() => this.manageDrops(message));

    const prefix = await message.channel.guild.getPrefix()!;
    if (!message.content.startsWith(prefix)) {
      return;
    }

    const content = message.content.substring(prefix.length);
    const matches = content.matchAll(/('.+?'|".+?"|`.+?`)|[\S]+/g);

    const commandName: string = matches.next().value?.[0].toLowerCase();
    if (!commandName) {
      return;
    }
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
          await this.createMessage(
            message,
            `Missing argument \`${commandArgName}\`!`
          );
          return;
        }
        break;
      }

      const argInput = commandArg.matchRest
        ? content.slice(arg.index)
        : arg[1]?.slice(1, -1) ?? arg[0];

      const value = await commandArg.resolve(argInput, message);
      if (!((await commandArg.validate?.(value, message)) ?? true)) {
        await this.createMessage(
          message,
          `The input you provided for argument \`${
            commandArgName
          }\` is invalid!`
        );
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
      invokedAs: commandName,
    };

    const middlewareResult = await command.middleware(context);
    if (middlewareResult !== true) {
      if (middlewareResult !== false) {
        await this.createMessage(message, middlewareResult);
      }
      return;
    }

    const result = await command.run(context);

    if (!result) {
      return;
    }

    await this.createMessage(message, result);
  }

  async createMessage(message: Message, data: MessageContent) {
    const content = typeof data === 'string' ? data : data.content;
    const chunks = content?.match(/[\s\S]{1,2000}/g);

    const sent = [];

    sent.push(
      await this.client.createMessage(message.channel.id, {
        ...(typeof data === 'string' ? undefined : data),
        content: chunks?.shift(),
        messageReference: {
          messageID: message.id,
        }
      })
    );

    for (const chunk of chunks ?? []) {
      sent.push(await this.client.createMessage(message.channel.id, chunk));
    }

    return sent;
  }

  deleteMessages(channelID: string, messages: Message[], reason?: string) {
    const messagesToDelete = messages.map((message) => message.id);
    return this.client.deleteMessages(channelID, messagesToDelete, reason);
  }
}
